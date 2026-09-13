const URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const dbConfigured = Boolean(URL && KEY)
const headers = () => ({ apikey: KEY, Authorization: `Bearer ${localStorage.getItem('capy_access_token') || KEY}`, 'Content-Type': 'application/json' })
const publicHeaders = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}` })

async function request(path, options = {}, auth = false) {
  if (!dbConfigured) throw new Error('SUPABASE_NOT_CONFIGURED')
  const res = await fetch(`${URL}${path}`, { ...options, headers: { ...(auth ? headers() : publicHeaders()), ...(options.headers || {}) } })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Supabase ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export async function signIn(email, password) {
  if (!dbConfigured) throw new Error('SUPABASE_NOT_CONFIGURED')
  const res = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Đăng nhập thất bại')
  localStorage.setItem('capy_access_token', data.access_token)
  localStorage.setItem('capy_refresh_token', data.refresh_token || '')
  localStorage.setItem('capy_admin_email', data.user?.email || email)
  return data
}

export async function signOut() {
  try { await request('/auth/v1/logout', { method: 'POST' }, true) } catch {}
  localStorage.removeItem('capy_access_token')
  localStorage.removeItem('capy_refresh_token')
  localStorage.removeItem('capy_admin_email')
}

export function isAdminSignedIn() { return Boolean(localStorage.getItem('capy_access_token')) }
export function adminEmail() { return localStorage.getItem('capy_admin_email') || '' }

const q = (path) => path

export async function fetchData(fallbacks) {
  if (!dbConfigured) return fallbacks
  const [cameras, samples, plans, policies, settings, orders] = await Promise.all([
    request(q('/rest/v1/cameras?select=*&order=id.asc')),
    request(q('/rest/v1/samples?select=*&order=sort_order.asc,created_at.asc')),
    request(q('/rest/v1/plans?select=*&order=sort_order.asc')),
    request(q('/rest/v1/policies?select=*&order=sort_order.asc')),
    request(q('/rest/v1/settings?id=eq.1&select=*&limit=1')),
    isAdminSignedIn() ? request(q('/rest/v1/orders?select=*&order=created_at.desc'), {}, true) : Promise.resolve([])
  ])
  const mappedCameras = (cameras || []).map(c => ({ ...c, longRates: c.long_rates || {}, hourlyRates: c.hourly_rates || {} }))
  const mappedSettings = settings?.[0] ? ({ ...fallbacks.settings, ...settings[0], contactTitle: settings[0].contact_title || '', contactItalic: settings[0].contact_italic || '', contactSubtext: settings[0].contact_subtext || '', qrImage: settings[0].qr_image || '', heroImage: settings[0].hero_image || '' }) : fallbacks.settings
  return {
    cameras: mappedCameras.length ? mappedCameras : fallbacks.cameras,
    samples: samples?.length ? samples : fallbacks.samples,
    plans: plans?.length ? plans : fallbacks.plans,
    policies: policies?.length ? policies.map(p => [p.num, p.title, p.text]) : fallbacks.policies,
    settings: mappedSettings,
    orders: orders || []
  }
}

export async function upsertCamera(camera) {
  const row = { id: camera.id, name: camera.name, brand: camera.brand, type: camera.type, price: Number(camera.price || 0), long_rates: camera.longRates || {}, hourly_rates: camera.hourlyRates || {}, lens: camera.lens || '', desc: camera.desc || '', image: camera.image || '', available: camera.available !== false }
  return request('/rest/v1/cameras?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(row) }, true)
}
export async function deleteCamera(id) { return request(`/rest/v1/cameras?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }, true) }

export async function upsertSample(sample) {
  const row = { id: sample.id, src: sample.src, description: sample.description || '', sort_order: Number(sample.sort_order || 0) }
  return request('/rest/v1/samples?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(row) }, true)
}
export async function deleteSample(id) { return request(`/rest/v1/samples?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }, true) }

export async function upsertPlan(plan, sort_order) {
  const row = { id: plan.id, title: plan.title, price: Number(plan.price || 0), note: plan.note || '', badge: plan.badge || '', sort_order }
  return request('/rest/v1/plans?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(row) }, true)
}

export async function upsertSettings(settings) {
  const row = { id: 1, name: settings.name || '', phone: settings.phone || '', zalo: settings.zalo || '', facebook: settings.facebook || '', address: settings.address || '', contact_title: settings.contactTitle || '', contact_italic: settings.contactItalic || '', contact_subtext: settings.contactSubtext || '', qr_image: settings.qrImage || '', hero_image: settings.heroImage || '' }
  return request('/rest/v1/settings?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(row) }, true)
}

export async function insertOrder(order) {
  const row = { camera_id: order.cameraId || null, camera: order.camera, plan: order.plan, customer: order.customer, status: order.status || 'Mới' }
  return request('/rest/v1/orders', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) }, false)
}


export async function checkCameraAvailable(cameraId, date, plan, startTime='00:00', hours=1) {
  const rows = await request('/rest/v1/rpc/is_camera_available', { method:'POST', body: JSON.stringify({ p_camera_id:Number(cameraId), p_date:date, p_plan:plan, p_start_time:startTime, p_hours:Number(hours||1) }) }, false)
  return rows === true || rows?.result === true
}
export async function getAvailableCameraIds(date, plan, startTime='00:00', hours=1) {
  const rows = await request('/rest/v1/rpc/get_available_camera_ids', { method:'POST', body: JSON.stringify({ p_date:date, p_plan:plan, p_start_time:startTime, p_hours:Number(hours||1) }) }, false)
  return (rows || []).map(x => Number(x.id ?? x))
}

async function dataUrlToFile(dataUrl, filename='image.jpg') {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], filename, { type: blob.type || 'image/jpeg' })
}
async function maybeUpload(src, folder, filename='image.jpg') {
  if (typeof src !== 'string' || !src.startsWith('data:')) return src
  try { return await uploadImage(await dataUrlToFile(src, filename), folder) } catch { return src }
}

export async function uploadImage(file, folder = 'images') {
  if (!dbConfigured) throw new Error('SUPABASE_NOT_CONFIGURED')
  if (!isAdminSignedIn()) throw new Error('Bạn cần đăng nhập admin.')
  const safe = `${Date.now()}-${String(file.name || 'image').replace(/[^a-zA-Z0-9._-]/g, '-')}`
  const path = `${folder}/${safe}`
  const res = await fetch(`${URL}/storage/v1/object/capy-images/${path}`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${localStorage.getItem('capy_access_token')}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' }, body: file })
  if (!res.ok) throw new Error(await res.text())
  return `${URL}/storage/v1/object/public/capy-images/${path}`
}

export async function seedIfEmpty(defaults) {
  if (!dbConfigured || !isAdminSignedIn()) return
  const existing = await request('/rest/v1/cameras?select=id&limit=1')
  if (existing?.length) return
  for (const c of defaults.cameras) await upsertCamera(c)
  for (let i = 0; i < defaults.samples.length; i++) await upsertSample({ ...defaults.samples[i], id: crypto.randomUUID(), sort_order: i })
  for (let i = 0; i < defaults.plans.length; i++) await upsertPlan(defaults.plans[i], i)
  for (let i = 0; i < defaults.policies.length; i++) { const [num,title,text] = defaults.policies[i]; await request('/rest/v1/policies?on_conflict=num', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: JSON.stringify({ num, title, text, sort_order: i }) }, true) }
  await upsertSettings(defaults.settings)
}

export async function migrateLocalStorage(defaults) {
  if (!dbConfigured || !isAdminSignedIn()) throw new Error('Hãy đăng nhập admin trước.')
  const cameras = (() => { try { return JSON.parse(localStorage.getItem('capy_cameras')) || defaults.cameras } catch { return defaults.cameras } })()
  const samples = (() => { try { return JSON.parse(localStorage.getItem('capy_samples')) || defaults.samples } catch { return defaults.samples } })()
  const plans = (() => { try { return JSON.parse(localStorage.getItem('capy_plans')) || defaults.plans } catch { return defaults.plans } })()
  const settings = (() => { try { return JSON.parse(localStorage.getItem('capy_settings')) || defaults.settings } catch { return defaults.settings } })()
  const orders = (() => { try { return JSON.parse(localStorage.getItem('capy_orders')) || [] } catch { return [] } })()
  for (const c of cameras) await upsertCamera({ ...c, image: await maybeUpload(c.image,'cameras',`${c.id||Date.now()}.jpg`) })
  for (let i = 0; i < samples.length; i++) await upsertSample({ ...samples[i], id: samples[i].id || crypto.randomUUID(), src: await maybeUpload(samples[i].src,'samples',`${i+1}.jpg`), sort_order: i })
  for (let i = 0; i < plans.length; i++) await upsertPlan(plans[i], i)
  await upsertSettings({ ...settings, qrImage: await maybeUpload(settings.qrImage,'qr','qr.jpg'), heroImage: await maybeUpload(settings.heroImage,'banners','hero.jpg') })
  for (const o of orders) await insertOrder(o)
  return fetchData(defaults)
}
