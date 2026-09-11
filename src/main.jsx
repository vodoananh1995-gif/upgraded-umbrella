import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Camera, Check, ChevronRight, Copy, MapPin, Menu, MessageCircle, Phone, Plus, Save, Settings, Trash2, X, Pencil, Image as ImageIcon, ClipboardList, LogOut } from 'lucide-react'
import './styles.css'

const defaultCameras = [
  { id: 1, name: 'Canon Sure Shot', brand: 'Canon', type: 'Máy phim', price: 120000, hourlyRates: {1:60000,3:150000,5:220000,session:250000}, lens: '38mm f/2.8', desc: 'Point & shoot nhỏ gọn, màu ảnh hoài niệm.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85', available: true },
  { id: 2, name: 'Fujifilm X-A5', brand: 'Fujifilm', type: 'Máy digital', price: 120000, hourlyRates: {1:70000,3:180000,5:280000,session:320000}, lens: '15–45mm', desc: 'Nhẹ, dễ dùng, hợp đi chơi và chụp đời thường.', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=85', available: true },
  { id: 3, name: 'Olympus Mju', brand: 'Olympus', type: 'Máy phim', price: 150000, hourlyRates: {1:70000,3:180000,5:280000,session:320000}, lens: '35mm f/2.8', desc: 'Nhỏ gọn, flash tiện dụng, màu phim rất dễ thương.', image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1200&q=85', available: true },
  { id: 4, name: 'Canon AE-1', brand: 'Canon', type: 'Máy phim', price: 180000, hourlyRates: {1:80000,3:210000,5:320000,session:360000}, lens: '50mm f/1.8', desc: 'Máy film cơ kinh điển cho người thích trải nghiệm.', image: 'https://images.unsplash.com/photo-1606986628253-4f56d7a7e83a?auto=format&fit=crop&w=1200&q=85', available: true },
  { id: 5, name: 'Fujifilm X-T20', brand: 'Fujifilm', type: 'Máy digital', price: 180000, hourlyRates: {1:100000,3:270000,5:400000,session:450000}, lens: '18–55mm', desc: 'Chất ảnh đẹp, thân máy nhỏ, hợp chụp phố.', image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1200&q=85', available: true },
  { id: 6, name: 'Olympus Trip 35', brand: 'Olympus', type: 'Máy phim', price: 130000, hourlyRates: {1:60000,3:150000,5:220000,session:250000}, lens: '40mm f/2.8', desc: 'Một chiếc máy cổ điển rất dễ làm quen.', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=85', available: true },
]

const defaultSamples = [
  'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85',
]

const defaultPlans = [
  { id: 'hourly', title: 'Theo giờ', price: 60000, note: 'Chọn 1 giờ, 3 giờ, 5 giờ hoặc 1 buổi.', badge: 'Linh hoạt' },
  { id: '1-day', title: '1 ngày', price: 120000, note: 'Hợp cho buổi dạo phố, chụp sự kiện ngắn.', badge: 'Phổ biến' },
  { id: '3-day', title: '3 ngày', price: 300000, note: 'Đủ thời gian rong ruổi và thử nhiều góc máy.' },
  { id: '7-day', title: '1 tuần', price: 600000, note: 'Cho chuyến đi dài hoặc dự án ảnh cá nhân.' },
]

const defaultPolicies = [
  ['01', 'Kiểm tra khi nhận máy', 'Máy được test hoạt động và đủ phụ kiện trước lúc giao. Báo ngay cho Capy nếu bạn thấy bất thường.'],
  ['02', 'Giữ máy đúng cách', 'Tránh nước, cát và va đập; không tự tháo máy, thay linh kiện hay chỉnh sửa firmware.'],
  ['03', 'Trầy xước & lỗi nhẹ', 'Trầy nhẹ vỏ máy: 100.000–300.000đ. Mất nắp ống kính hoặc dây đeo: 50.000đ.'],
  ['04', 'Hư hỏng nặng', 'Vỡ ống kính hoặc cảm biến: 50–80% giá trị máy. Mất máy: đền 100% giá trị.'],
  ['05', 'Cọc giữ máy', 'Liên hệ trước để giữ máy; cọc qua chuyển khoản hoặc CCCD khi nhận máy trực tiếp tại tiệm.'],
]

const defaultSettings = { name: 'Tiệm Ảnh Capy', phone: 'xxx xxx xxxx', zalo: '#', facebook: '#', address: 'Bàu Tró, Quảng Trị', heroImage: 'https://images.unsplash.com/photo-1502980426475-b83966705988?auto=format&fit=crop&w=1400&q=90', password: 'capy1234' }

const formatVnd = (n) => new Intl.NumberFormat('vi-VN').format(Number(n) || 0) + 'đ'
const load = (key, fallback) => { try { const x = localStorage.getItem(key); return x ? JSON.parse(x) : fallback } catch { return fallback } }
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const normalizeHourlyRates = (c) => {
  const base = Number(c.hourlyPrice || c.hourlyRates?.[1] || Math.max(50000, Math.round((Number(c.price) || 120000) * 0.5 / 10000) * 10000))
  const r = c.hourlyRates || {}
  return { 1: Number(r[1] || base), 3: Number(r[3] || Math.round(base * 2.5 / 10000) * 10000), 5: Number(r[5] || Math.round(base * 4 / 10000) * 10000), session: Number(r.session || Math.round(base * 4.5 / 10000) * 10000) }
}
const loadCameras = () => load('capy_cameras', defaultCameras).map(c => ({ ...c, hourlyRates: normalizeHourlyRates(c) }))
const hourlyOptions = [{ key: '1', label: '1 tiếng', hours: 1 }, { key: '3', label: '3 tiếng', hours: 3 }, { key: '5', label: '5 tiếng', hours: 5 }, { key: 'session', label: '1 buổi', hours: 4 }]
const getHourlyRate = (camera, key) => Number(camera?.hourlyRates?.[key] || camera?.hourlyPrice || 0)

function Site({ data }) {
  const { cameras, samples, plans, policies, settings, orders } = data
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('capy_theme') || 'film')
  const [type, setType] = useState('Tất cả loại')
  const [brand, setBrand] = useState('Tất cả hãng')
  const [sort, setSort] = useState('low')
  const [modalOpen, setModalOpen] = useState(false)
  const [chosen, setChosen] = useState(null)
  const [plan, setPlan] = useState('1-day')
  const [copied, setCopied] = useState(false)
  const [customer, setCustomer] = useState({ name: '', phone: '', date: '', startTime: '09:00', endTime: '12:00', hours: 1, hourlyOption: '1' })
  const [conflict, setConflict] = useState(null)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)

  const brands = ['Tất cả hãng', ...new Set(cameras.map(c => c.brand))]
  const filtered = useMemo(() => {
    const list = cameras.filter(c => (type === 'Tất cả loại' || c.type === type) && (brand === 'Tất cả hãng' || c.brand === brand))
    return [...list].sort((a, b) => sort === 'low' ? a.price - b.price : b.price - a.price)
  }, [cameras, type, brand, sort])

  const openReserve = (camera = null) => { setChosen(camera); setPlan('1-day'); setCopied(false); setConflict(null); setAvailabilityChecked(false); setCustomer({ name: '', phone: '', date: '', startTime: '09:00', endTime: '12:00', hours: 1, hourlyOption: '1' }); setModalOpen(true) }
  const selectedPlan = plans.find(x => x.id === plan)
  const selectedHourlyPrice = plan === 'hourly' ? getHourlyRate(chosen, customer.hourlyOption || '1') : Number(selectedPlan?.price || 0)
  const timeToMinutes = (value) => { if (!value) return 0; const [h,m] = value.split(':').map(Number); return h*60+m }
  const bookingWindow = () => {
    if (!customer.date) return null
    if (plan === 'hourly') {
      const start = timeToMinutes(customer.startTime)
      const end = start + Number(customer.hours || 1) * 60
      return { start, end }
    }
    return { start: 0, end: 24*60 }
  }
  const findConflict = (cameraName = chosen?.name) => {
    if (!cameraName || !customer.date) return null
    const wanted = bookingWindow()
    if (!wanted) return null
    return orders.find(o => o.camera === cameraName && o.customer?.date === customer.date && o.status !== 'Hủy' && (() => {
      if (o.plan !== 'hourly' || plan !== 'hourly') return true
      const os = timeToMinutes(o.customer?.startTime || '00:00')
      const oe = os + Number(o.customer?.hours || 1) * 60
      return wanted.start < oe && wanted.end > os
    })()) || null
  }
  const checkAvailability = () => {
    if (!chosen) { alert('Vui lòng chọn máy ảnh trước khi kiểm tra lịch.'); return false }
    if (!customer.date) { alert('Vui lòng chọn ngày nhận máy.'); return false }
    const found = findConflict()
    setConflict(found)
    setAvailabilityChecked(true)
    return !found
  }
  const availableCameras = availabilityChecked && customer.date
    ? cameras.filter(c => c.available !== false && !findConflict(c.name))
    : []
  const messageText = () => {
    const machine = chosen?.name || 'chưa chọn máy'
    const hourlyLabel = hourlyOptions.find(x => x.key === (customer.hourlyOption || '1'))?.label || `${customer.hours || 1} tiếng`
    const timeText = plan === 'hourly' ? `${customer.startTime || '--:--'} - ${customer.startTime ? `${String(Math.floor((timeToMinutes(customer.startTime) + Number(customer.hours || 1)*60)/60)%24).padStart(2,'0')}:${String((timeToMinutes(customer.startTime) + Number(customer.hours || 1)*60)%60).padStart(2,'0')}` : '--:--'} (${hourlyLabel})` : selectedPlan?.title || '1 ngày'
    return `Xin chào Capy, mình muốn thuê ${machine} trong ${timeText}${plan === 'hourly' ? `, giá tạm tính ${formatVnd(selectedHourlyPrice)}` : ''}. Tên: ${customer.name || 'chưa nhập'}. SĐT: ${customer.phone || 'chưa nhập'}. Ngày nhận: ${customer.date || 'chưa chọn'}. Nhờ Capy kiểm tra tình trạng máy và báo giúp mình tiền cọc.`
  }
  const copyRequest = async () => { try { await navigator.clipboard.writeText(messageText()); setCopied(true) } catch {} }
  const submitOrder = () => {
    if (!chosen) { alert('Vui lòng chọn máy ảnh trước khi lưu yêu cầu.'); return }
    if (!customer.date) { alert('Vui lòng chọn ngày nhận máy.'); return }
    if (!checkAvailability()) return
    const next = [{ id: Date.now(), camera: chosen.name, plan, customer, createdAt: new Date().toLocaleString('vi-VN'), status: 'Mới' }, ...orders]
    save('capy_orders', next)
    setCopied(false)
    alert('Máy đang trống trong khung thời gian bạn chọn. Đã lưu yêu cầu đặt máy.')
  }

  const changeTheme = (value) => { setTheme(value); localStorage.setItem('capy_theme', value) }

  return <div className={`siteApp theme-${theme}`}>
    <div className="photoGrain" aria-hidden="true" />
    <header className="siteHeader"><div className="container navBar">
      <a className="brand" href="#top" onClick={() => setMenuOpen(false)}><span className="brandMark"><Camera size={19} /></span><span>{settings.name}</span></a>
      <button className="mobileMenu" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'navLinks open' : 'navLinks'}>{[['Máy cho thuê','#may'],['Ảnh mẫu','#anh'],['Bảng giá','#gia'],['Chính sách','#cs'],['Liên hệ','#lien']].map(([l,h]) => <a key={h} href={h} onClick={() => setMenuOpen(false)}>{l}</a>)}<div className="themePicker"><span>THEMES</span><button className={theme==='film'?'active':''} onClick={()=>changeTheme('film')} title="Capy Film"><span/></button><button className={theme==='blush'?'active':''} onClick={()=>changeTheme('blush')} title="Pastel Blush"><span/></button><button className={theme==='mint'?'active':''} onClick={()=>changeTheme('mint')} title="Darkroom Green"><span/></button><button className={theme==='night'?'active':''} onClick={()=>changeTheme('night')} title="Night Lab"><span/></button></div><button className="navCta" onClick={() => openReserve()}>Đặt máy giữ chỗ <ChevronRight size={16}/></button></nav>
    </div></header>

    <main id="top">
      <section className="hero container"><div className="heroCopy"><div className="photoBadge"><Camera size={14}/> FILM / DIGITAL / EVERYDAY</div><div className="eyebrow">✦ CAMERA RENTAL · BÀU TRÓ</div><h1>Cầm máy lên,<br/><i>còn lại để Capy lo.</i></h1><p>Chọn chiếc máy hợp gu, xem thông tin rõ ràng và giữ chỗ trong vài phút. Mỗi máy đều được test trước khi giao.</p><div className="heroActions"><a className="button primary" href="#may">Xem máy cho thuê <ChevronRight size={17}/></a><button className="button ghost" onClick={() => openReserve()}>Liên hệ đặt cọc</button></div><div className="heroMeta"><span>{cameras.filter(c=>c.available !== false).length} máy sẵn sàng</span><span>•</span><span>Hỗ trợ nhanh qua Zalo</span></div></div><div className="heroVisual"><img src={settings.heroImage} alt="Tiệm Ảnh Capy"/><div className="heroSticker"><strong>Ảnh thật · Máy thật</strong><span>Test trước khi giao</span></div><div className="verticalTag">CAPY / FILM & DIGITAL</div></div></section>

      <section className="section container" id="may"><div className="sectionIntro"><div><div className="eyebrow">CHO THUÊ</div><h2>Từ máy phim cổ điển<br/><i>đến digital gọn nhẹ.</i></h2></div><p>Lọc theo loại máy hoặc hãng, sắp xếp theo giá và chọn đúng chiếc máy cho chuyến đi của bạn.</p></div><div className="toolbar"><div className="filterGroups"><div className="chips">{['Tất cả loại','Máy phim','Máy digital'].map(v => <button key={v} className={type===v?'chip active':'chip'} onClick={()=>setType(v)}>{v}</button>)}</div><div className="chips">{brands.map(v => <button key={v} className={brand===v?'chip active':'chip'} onClick={()=>setBrand(v)}>{v}</button>)}</div></div><select value={sort} onChange={e=>setSort(e.target.value)}><option value="low">Giá thấp → cao</option><option value="high">Giá cao → thấp</option></select></div>
        {filtered.length ? <div className="cameraGrid">{filtered.map(c=><article className="cameraCard" key={c.id}><div className="cardImage"><img src={c.image} alt={c.name}/><span>{c.type}</span>{c.available===false&&<b className="soldOut">Đang thuê</b>}</div><div className="cardContent"><div className="cardTop"><span>{c.brand}</span><strong>{formatVnd(c.price)}<small>/ngày</small></strong><span className="hourlyCardPrice">1h {formatVnd(getHourlyRate(c,'1'))}</span></div><h3>{c.name}</h3><div className="lensTag">{c.lens}</div><p>{c.desc}</p><div className="hourlyPriceTiers">{hourlyOptions.map(opt=><span key={opt.key}>{opt.label}: {formatVnd(getHourlyRate(c,opt.key))}</span>)}</div><button disabled={c.available===false} className="reserveButton" onClick={()=>openReserve(c)}>{c.available===false?'Đang thuê':'Giữ máy'} <span>↗</span></button></div></article>)}</div>:<div className="empty">Không có máy nào khớp bộ lọc.</div>}
      </section>

      <section className="sampleSection" id="anh"><div className="filmStrip" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/><span/></div><div className="container section"><div className="sectionIntro"><div><div className="eyebrow">ẢNH MẪU</div><h2>Capy chụp thử —<br/><i>cuộn phim xem liền.</i></h2></div><p>Một vài khung hình để bạn hình dung màu, độ nét và cảm giác khi cầm những chiếc máy đang cho thuê.</p></div><div className="sampleGrid">{samples.map((src,i)=><img key={i} className={i===0?'featureSample':''} src={src} alt={`Ảnh mẫu ${i+1}`}/>)}</div></div></section>

      <section className="section container" id="gia"><div className="sectionIntro oneCol"><div><div className="eyebrow">BẢNG GIÁ</div><h2>Thuê theo ngày,<br/><i>dài hơn thì rẻ hơn.</i></h2></div></div><div className="priceGrid">{plans.map((item,i)=><article key={item.id} className={i===0?'priceCard featured':'priceCard'}><div className="priceTitle"><h3>{item.title}</h3>{item.badge&&<span>{item.badge}</span>}</div><div className="priceValue">{formatVnd(item.price)}<small>/ máy</small></div><p>{item.note}</p><button onClick={()=>{setChosen(null);setPlan(item.id);setModalOpen(true)}}>Chọn gói <ChevronRight size={15}/></button></article>)}</div><div className="hourlyRatesBlock"><div className="hourlyRatesIntro"><div><div className="eyebrow">GIÁ THEO GIỜ</div><h3>Mỗi máy một mức giá,<br/><i>chọn đúng thời lượng.</i></h3></div><p>Giá được tính riêng theo từng máy. Chọn 1 tiếng, 3 tiếng, 5 tiếng hoặc 1 buổi khi đặt máy.</p></div><div className="hourlyRatesTable"><div className="hourlyRatesHeader"><span>Máy ảnh</span><span>1 tiếng</span><span>3 tiếng</span><span>5 tiếng</span><span>1 buổi</span><span>1 ngày</span><span>3 ngày</span><span>1 tuần</span></div>{cameras.map(c=><div className="hourlyRatesRow" key={c.id}><strong>{c.name}</strong><span>{formatVnd(getHourlyRate(c,'1'))}</span><span>{formatVnd(getHourlyRate(c,'3'))}</span><span>{formatVnd(getHourlyRate(c,'5'))}</span><span>{formatVnd(getHourlyRate(c,'session'))}</span><span>{formatVnd(plans.find(p=>p.id==='1-day')?.price || c.price)}</span><span>{formatVnd(plans.find(p=>p.id==='3-day')?.price || 300000)}</span><span>{formatVnd(plans.find(p=>p.id==='7-day')?.price || 600000)}</span></div>)}</div></div></section>

      <section className="policySection" id="cs"><div className="container section"><div className="sectionIntro"><div><div className="eyebrow">CHÍNH SÁCH THUÊ MÁY</div><h2>Rõ ràng trước,<br/><i>vui vẻ sau.</i></h2></div><p>Điều khoản cơ bản để cả Capy và bạn đều yên tâm.</p></div><div className="policyList">{policies.map(([num,title,text])=><div className="policyRow" key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

      <section className="contact container" id="lien"><div className="contactCopy"><div className="eyebrow">LIÊN HỆ</div><h2>Nhắn Capy để<br/><i>giữ máy.</i></h2><p>Hotline / Zalo: <strong>{settings.phone}</strong></p><div className="contactActions"><a className="button primary" href={settings.zalo}><MessageCircle size={17}/> Nhắn Zalo</a><a className="button ghost" href={`tel:${settings.phone.replace(/\D/g,'')}`}><Phone size={17}/> Gọi cho tiệm</a></div><div className="address"><MapPin size={17}/> {settings.address}</div></div><div className="qrPanel"><div className="qrPlaceholder"><span>QR</span><small>Thay bằng mã Zalo thật</small></div><p>Quét mã để nhắn trực tiếp cho {settings.name}</p></div></section>
    </main>
    <footer><div className="container footerInner"><span>{settings.name} · Cho thuê máy ảnh</span><span>Quản trị: /admin</span></div></footer>

    {modalOpen&&<div className="modalBackdrop" onClick={()=>setModalOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modalClose" onClick={()=>setModalOpen(false)}><X size={18}/></button><div className="eyebrow">ĐẶT MÁY GIỮ CHỖ</div><h2>{chosen?.name||'Chọn máy tại Capy'}</h2><p>Chọn máy trực tiếp, thời gian thuê và thông tin liên hệ. Capy sẽ kiểm tra lịch trước khi xác nhận.</p><label>Chọn máy trực tiếp<select value={chosen?.id || ''} onChange={e=>{const cam=cameras.find(c=>String(c.id)===e.target.value);setChosen(cam||null);setConflict(null);setAvailabilityChecked(false)}}><option value="">— Chọn máy ảnh —</option>{cameras.map(c=><option key={c.id} value={c.id} disabled={c.available===false}>{c.name} · {c.brand}{c.available===false?' · đang thuê':''}</option>)}</select></label><div className="formGrid"><label>Họ tên<input value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="Nguyễn Văn A"/></label><label>Số điện thoại<input value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} placeholder="09xxxxxxxx"/></label><label>Ngày nhận<input type="date" value={customer.date} onChange={e=>{setCustomer({...customer,date:e.target.value});setConflict(null);setAvailabilityChecked(false)}}/></label></div><div className="planPicker">{plans.map(item=><button key={item.id} className={plan===item.id?'active':''} onClick={()=>{setPlan(item.id);setConflict(null);setAvailabilityChecked(false)}}>{item.title}{item.id==='hourly' && chosen ? <small>Từ {formatVnd(getHourlyRate(chosen,'1'))}</small> : null}</button>)}</div>{plan==='hourly'&&<><div className="hourlyOptionGrid">{hourlyOptions.map(opt=><button key={opt.key} type="button" className={customer.hourlyOption===opt.key?'active':''} onClick={()=>{setCustomer({...customer,hours:opt.hours,hourlyOption:opt.key});setConflict(null);setAvailabilityChecked(false)}}><b>{opt.label}</b><small>{chosen ? formatVnd(getHourlyRate(chosen,opt.key)) : 'Chọn máy'}</small></button>)}</div><div className="formGrid"><label>Giờ bắt đầu<input type="time" value={customer.startTime} onChange={e=>{setCustomer({...customer,startTime:e.target.value});setConflict(null);setAvailabilityChecked(false)}}/></label><div className="hourlySelectedPrice"><span>Giá thuê</span><strong>{chosen ? formatVnd(selectedHourlyPrice) : '—'}</strong><small>{hourlyOptions.find(x=>x.key===customer.hourlyOption)?.label || '1 tiếng'}</small></div></div></>}<button className="checkAvailabilityButton" onClick={checkAvailability}><Check size={16}/> Kiểm tra lịch máy</button>{conflict&&<div className="conflictBox"><strong>⚠ Máy đã trùng lịch</strong><span>{chosen?.name} đã có lịch vào {conflict.customer?.date}{conflict.plan==='hourly' ? ` · ${conflict.customer?.startTime || ''} (${conflict.customer?.hours || 1} giờ)` : ' · cả ngày'}.</span><a className="hotlineButton" href={`tel:${settings.phone.replace(/\D/g,'')}`}><Phone size={16}/> Liên hệ Hotline {settings.phone}</a></div>}{availabilityChecked&&!conflict&&chosen&&<div className="availableBox"><Check size={16}/><div><strong>✓ Máy đang trống lịch</strong><span>{chosen.name} hiện còn trống cho thời gian bạn chọn.</span></div></div>}{availabilityChecked&&customer.date&&<div className="availabilityPanel"><div className="availabilityHead"><strong>Máy đang trống lịch</strong><span>{availableCameras.length} máy có thể đặt</span></div>{availableCameras.length ? <div className="availabilityList">{availableCameras.map(c=><button key={c.id} type="button" className={`availabilityItem ${chosen?.id===c.id?'selected':''}`} onClick={()=>{setChosen(c);setConflict(null);setAvailabilityChecked(true)}}><span className="availabilityDot"></span><span className="availabilityInfo"><b>{c.name}</b><small>{c.brand} · {c.type}</small></span><span className="availabilityPrice"><b>{hourlyOptions.find(x=>x.key===customer.hourlyOption)?.label || '1 tiếng'} {formatVnd(getHourlyRate(c, customer.hourlyOption || '1'))}</b><small>1 ngày {formatVnd(c.price)}</small></span>{chosen?.id===c.id&&<Check size={16}/>}</button>)}</div> : <div className="availabilityEmpty">Hiện không còn máy trống trong khung thời gian này.</div>}</div>}<div className="requestBox">{messageText()}</div><div className="modalActions"><button className="copyButton" onClick={copyRequest}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'Đã sao chép':'Sao chép nội dung'}</button>{!conflict?<button className="button primary" onClick={submitOrder}>Lưu yêu cầu <ChevronRight size={15}/></button>:<a className="button hotlinePrimary" href={`tel:${settings.phone.replace(/\D/g,'')}`}><Phone size={15}/> Gọi Hotline</a>}</div></div></div>}
  </div>
}

function Admin({ data, setData }) {
  const [authed, setAuthed] = useState(sessionStorage.getItem('capy_admin') === '1')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('cameras')
  const [editing, setEditing] = useState(null)
  const [settingsDraft, setSettingsDraft] = useState(data.settings)

  const update = (key, value) => { const next = {...data, [key]: value}; setData(next); save(`capy_${key}`, value) }
  const login = e => { e.preventDefault(); if(password === data.settings.password){ sessionStorage.setItem('capy_admin','1'); setAuthed(true) } else alert('Sai mật khẩu. Mật khẩu mặc định là capy1234.') }
  if(!authed) return <div className="adminLogin"><form onSubmit={login} className="loginCard"><div className="brandMark"><Camera size={19}/></div><h1>Quản trị Tiệm Ảnh Capy</h1><p>Đăng nhập để quản lý máy ảnh, ảnh mẫu, bảng giá và đơn đặt.</p><input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu admin"/><button className="button primary">Đăng nhập</button><a href="/">← Về trang chủ</a></form></div>

  const saveCamera = () => { const normalized = {...editing, hourlyRates: normalizeHourlyRates(editing)}; const list = editing.id ? data.cameras.map(c=>c.id===editing.id?normalized:c) : [...data.cameras,{...normalized,id:Date.now(),available:true}]; update('cameras',list); setEditing(null) }
  const removeCamera = id => { if(confirm('Xóa máy ảnh này?')) update('cameras',data.cameras.filter(c=>c.id!==id)) }
  const addSample = () => { const url=prompt('Dán URL ảnh mẫu:'); if(url) update('samples',[...data.samples,url]) }
  const removeSample = i => update('samples',data.samples.filter((_,idx)=>idx!==i))
  const saveSettings = () => { const next={...data,settings:settingsDraft}; setData(next); save('capy_settings',settingsDraft); alert('Đã lưu cài đặt.') }

  return <div className="adminShell"><aside className="adminSide"><div className="adminLogo"><span className="brandMark"><Camera size={18}/></span><b>Tiệm Ảnh Capy</b></div><div className="adminMenu">{[["cameras","Máy ảnh",Camera],["samples","Ảnh mẫu",ImageIcon],["plans","Bảng giá",Save],["orders","Đơn đặt máy",ClipboardList],["settings","Cài đặt",Settings]].map(([id,label,Icon])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon size={17}/>{label}</button>)}</div><button className="logout" onClick={()=>{sessionStorage.removeItem('capy_admin');setAuthed(false)}}><LogOut size={16}/> Đăng xuất</button></aside>
    <main className="adminMain"><div className="adminTop"><div><span className="eyebrow">QUẢN TRỊ</span><h1>{tab==='cameras'?'Danh sách máy ảnh':tab==='samples'?'Ảnh mẫu':tab==='plans'?'Bảng giá':tab==='orders'?'Đơn đặt máy':'Cài đặt website'}</h1></div><a className="button ghost" href="/">Xem website ↗</a></div>
      {tab==='cameras'&&<><div className="adminToolbar"><p>{data.cameras.length} máy ảnh</p><button className="button primary" onClick={()=>setEditing({name:'',brand:'Canon',type:'Máy phim',price:120000,hourlyRates:{1:60000,3:150000,5:220000,session:250000},lens:'',desc:'',image:'',available:true})}><Plus size={16}/> Thêm máy ảnh</button></div><div className="adminTable">{data.cameras.map(c=><div className="adminRow" key={c.id}><img src={c.image} alt=""/><div><b>{c.name}</b><span>{c.brand} · {c.type}</span></div><strong>{formatVnd(c.price)}<small>1h {formatVnd(getHourlyRate(c,'1'))} · 1 buổi {formatVnd(getHourlyRate(c,'session'))}</small></strong><em className={c.available===false?'off':''}>{c.available===false?'Đang thuê':'Có sẵn'}</em><div className="rowActions"><button onClick={()=>setEditing({...c})}><Pencil size={15}/></button><button onClick={()=>removeCamera(c.id)}><Trash2 size={15}/></button></div></div>)}</div></>}
      {tab==='samples'&&<><div className="adminToolbar"><p>{data.samples.length} ảnh</p><button className="button primary" onClick={addSample}><Plus size={16}/> Thêm ảnh</button></div><div className="adminSamples">{data.samples.map((s,i)=><div key={i}><img src={s} alt=""/><button onClick={()=>removeSample(i)}><Trash2 size={15}/></button></div>)}</div></>}
      {tab==='plans'&&<div className="adminPlans">{data.plans.map((p,i)=><div className="editPanel" key={p.id}><h3>{p.title}</h3><label>Giá thuê<input type="number" value={p.price} onChange={e=>{const x=[...data.plans];x[i]={...p,price:Number(e.target.value)};update('plans',x)}}/></label><label>Mô tả<input value={p.note} onChange={e=>{const x=[...data.plans];x[i]={...p,note:e.target.value};update('plans',x)}}/></label><label>Nhãn (tuỳ chọn)<input value={p.badge||''} onChange={e=>{const x=[...data.plans];x[i]={...p,badge:e.target.value};update('plans',x)}}/></label></div>)}</div>}
      {tab==='orders'&&<div className="adminTable">{data.orders.length===0?<div className="empty">Chưa có đơn đặt máy.</div>:data.orders.map(o=><div className="orderRow" key={o.id}><div><b>{o.camera}</b><span>{o.customer.name||'Chưa nhập tên'} · {o.customer.phone||'Chưa có SĐT'}</span></div><span>{o.customer.date||'Chưa chọn ngày'}</span><span>{o.plan==='hourly' ? `${hourlyOptions.find(x=>x.key===o.customer?.hourlyOption)?.label || 'Theo giờ'} · ${formatVnd(getHourlyRate(data.cameras.find(c=>c.name===o.camera), o.customer?.hourlyOption || '1'))}` : (data.plans.find(p=>p.id===o.plan)?.title||o.plan)}</span><em>{o.status}</em><small>{o.createdAt}</small></div>)}</div>}
      {tab==='settings'&&<div className="settingsPanel"><label>Tên tiệm<input value={settingsDraft.name} onChange={e=>setSettingsDraft({...settingsDraft,name:e.target.value})}/></label><label>Số điện thoại<input value={settingsDraft.phone} onChange={e=>setSettingsDraft({...settingsDraft,phone:e.target.value})}/></label><label>Link Zalo<input value={settingsDraft.zalo} onChange={e=>setSettingsDraft({...settingsDraft,zalo:e.target.value})}/></label><label>Link Facebook<input value={settingsDraft.facebook} onChange={e=>setSettingsDraft({...settingsDraft,facebook:e.target.value})}/></label><label>Địa chỉ<input value={settingsDraft.address} onChange={e=>setSettingsDraft({...settingsDraft,address:e.target.value})}/></label><label>Ảnh banner trang chủ (URL)<input value={settingsDraft.heroImage} onChange={e=>setSettingsDraft({...settingsDraft,heroImage:e.target.value})}/></label><label>Mật khẩu admin<input type="password" value={settingsDraft.password} onChange={e=>setSettingsDraft({...settingsDraft,password:e.target.value})}/></label><button className="button primary" onClick={saveSettings}><Save size={16}/> Lưu cài đặt</button></div>}
    </main>
    {editing&&<div className="modalBackdrop"><div className="modal adminEdit"><button className="modalClose" onClick={()=>setEditing(null)}><X size={18}/></button><div className="eyebrow">MÁY ẢNH</div><h2>{editing.id?'Sửa máy':'Thêm máy'}</h2><div className="formGrid"><label>Tên máy<input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/></label><label>Hãng<input value={editing.brand} onChange={e=>setEditing({...editing,brand:e.target.value})}/></label><label>Loại<select value={editing.type} onChange={e=>setEditing({...editing,type:e.target.value})}><option>Máy phim</option><option>Máy digital</option></select></label><label>Giá/ngày<input type="number" value={editing.price} onChange={e=>setEditing({...editing,price:Number(e.target.value)})}/></label><label>Giá 1 tiếng<input type="number" value={editing.hourlyRates?.[1] || 0} onChange={e=>setEditing({...editing,hourlyRates:{...normalizeHourlyRates(editing),1:Number(e.target.value)}})}/></label><label>Giá 3 tiếng<input type="number" value={editing.hourlyRates?.[3] || 0} onChange={e=>setEditing({...editing,hourlyRates:{...normalizeHourlyRates(editing),3:Number(e.target.value)}})}/></label><label>Giá 5 tiếng<input type="number" value={editing.hourlyRates?.[5] || 0} onChange={e=>setEditing({...editing,hourlyRates:{...normalizeHourlyRates(editing),5:Number(e.target.value)}})}/></label><label>Giá 1 buổi<input type="number" value={editing.hourlyRates?.session || 0} onChange={e=>setEditing({...editing,hourlyRates:{...normalizeHourlyRates(editing),session:Number(e.target.value)}})}/></label><label>Ống kính<input value={editing.lens} onChange={e=>setEditing({...editing,lens:e.target.value})}/></label><label>URL ảnh<input value={editing.image} onChange={e=>setEditing({...editing,image:e.target.value})}/></label></div><label>Mô tả<textarea value={editing.desc} onChange={e=>setEditing({...editing,desc:e.target.value})}/></label><label className="checkLine"><input type="checkbox" checked={editing.available!==false} onChange={e=>setEditing({...editing,available:e.target.checked})}/> Máy đang sẵn sàng cho thuê</label><button className="button primary full" onClick={saveCamera}><Save size={16}/> Lưu máy ảnh</button></div></div>}
  </div>
}

function Root(){
  const [data,setDataState]=useState(()=>({cameras:loadCameras(),samples:load('capy_samples',defaultSamples),plans:load('capy_plans',defaultPlans),policies:defaultPolicies,settings:load('capy_settings',defaultSettings),orders:load('capy_orders',[])}))
  const setData = next => setDataState(next)
  return window.location.pathname.startsWith('/admin') ? <Admin data={data} setData={setData}/> : <Site data={data}/>
}

createRoot(document.getElementById('root')).render(<Root/>)
