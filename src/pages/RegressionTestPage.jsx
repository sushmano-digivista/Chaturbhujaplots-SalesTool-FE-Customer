import { useState } from 'react'
import { projectsApi, settingsApi, contentApi } from '@/api'

const DASH = 'https://chaturbhujaplots-sales-tool-be-dasb.vercel.app/api/v1'
const COMM = 'https://chaturbhujaplots-sales-tool-be-comm.vercel.app/api/v1'

const TESTS = [
  {
    section: 'Health Checks',
    tests: [
      { id:'h1', name:'CommonServices health endpoint', fn: async()=>{
        const r = await fetch(COMM.replace('/api/v1','')+'/health')
        const d = await r.json()
        if(d.status!=='UP') throw new Error('Status: '+d.status)
        return 'UP — '+d.service
      }},
      { id:'h2', name:'DashboardServices health endpoint', fn: async()=>{
        const r = await fetch(DASH.replace('/api/v1','')+'/health')
        const d = await r.json()
        if(d.status!=='UP') throw new Error('Status: '+d.status)
        return 'UP — '+d.service
      }},
    ]
  },
  {
    section: 'Settings API — anjana_common',
    tests: [
      { id:'s1', name:'GET /settings/contact returns 200', fn: async()=>{
        const d = await settingsApi.getContact()
        if(!d.ownerPhone) throw new Error('ownerPhone missing')
        if(!d.ownerEmail) throw new Error('ownerEmail missing')
        return 'phone: '+d.ownerPhone
      }},
      { id:'s2', name:'ownerPhone = 919948709041', fn: async()=>{
        const d = await settingsApi.getContact()
        if(d.ownerPhone!=='919948709041') throw new Error('Got: '+d.ownerPhone)
        return d.ownerPhone
      }},
      { id:'s3', name:'ownerEmail = msnraoooo@gmail.com', fn: async()=>{
        const d = await settingsApi.getContact()
        if(d.ownerEmail!=='msnraoooo@gmail.com') throw new Error('Got: '+d.ownerEmail)
        return d.ownerEmail
      }},
      { id:'s4', name:'aparna_contact_address has Gateway of Amaravati', fn: async()=>{
        const d = await settingsApi.getContact()
        if(!d.aparna_contact_address?.includes('Gateway of Amaravati')) throw new Error('Got: '+d.aparna_contact_address)
        return d.aparna_contact_address
      }},
    ]
  },
  {
    section: 'Projects API — anjana_dashboard',
    tests: [
      { id:'p1', name:'GET /projects returns array of 4', fn: async()=>{
        const d = await projectsApi.getAll()
        if(!Array.isArray(d)) throw new Error('Not an array')
        if(d.length!==4) throw new Error('Expected 4, got '+d.length)
        return '4 projects'
      }},
      { id:'p2', name:'All 4 project IDs present', fn: async()=>{
        const d = await projectsApi.getAll()
        const ids = d.map(p=>p.id)
        for(const id of ['anjana','aparna','varaha','trimbak']){
          if(!ids.includes(id)) throw new Error('Missing: '+id)
        }
        return ids.join(', ')
      }},
      { id:'p3', name:'Anjana Paradise — loc correct', fn: async()=>{
        const d = await projectsApi.getAll()
        const p = d.find(x=>x.id==='anjana')
        if(p.loc!=='Paritala, Near Amaravati') throw new Error('Got: '+p.loc)
        return p.loc
      }},
      { id:'p4', name:'Aparna Legacy — loc has Gateway of Amaravati', fn: async()=>{
        const d = await projectsApi.getAll()
        const p = d.find(x=>x.id==='aparna')
        if(!p.loc.includes('Gateway of Amaravati')) throw new Error('Got: '+p.loc)
        return p.loc
      }},
      { id:'p5', name:'Aparna Legacy — contact.address has Gateway of Amaravati', fn: async()=>{
        const d = await projectsApi.getAll()
        const p = d.find(x=>x.id==='aparna')
        if(!p.contact?.address?.includes('Gateway of Amaravati')) throw new Error('Got: '+p.contact?.address)
        return p.contact.address
      }},
      { id:'p6', name:'Varaha Virtue — total = 132', fn: async()=>{
        const d = await projectsApi.getAll()
        const p = d.find(x=>x.id==='varaha')
        if(p.total!==132) throw new Error('Got: '+p.total)
        return 'total: '+p.total
      }},
      { id:'p7', name:'Trimbak Oaks — upcoming = true', fn: async()=>{
        const d = await projectsApi.getAll()
        const p = d.find(x=>x.id==='trimbak')
        if(!p.upcoming) throw new Error('upcoming: '+p.upcoming)
        return 'upcoming: true'
      }},
      { id:'p8', name:'All projects have amenities', fn: async()=>{
        const d = await projectsApi.getAll()
        for(const p of d){
          if(!p.amenities?.length) throw new Error(p.name+' has no amenities')
        }
        return 'All 4 have amenities'
      }},
      { id:'p9', name:'All projects have distances', fn: async()=>{
        const d = await projectsApi.getAll()
        for(const p of d){
          if(!p.distances?.length) throw new Error(p.name+' has no distances')
        }
        return 'All 4 have distances'
      }},
      { id:'p10', name:'All projects have contact.phone', fn: async()=>{
        const d = await projectsApi.getAll()
        for(const p of d){
          if(!p.contact?.phone) throw new Error(p.name+' missing phone')
        }
        return 'All 4 have contact.phone'
      }},
      { id:'p11', name:'GET /projects/anjana returns correct project', fn: async()=>{
        const d = await projectsApi.getOne('anjana')
        if(d.id!=='anjana') throw new Error('Wrong id: '+d.id)
        return d.name+' — '+d.loc
      }},
      { id:'p12', name:'GET /projects/aparna returns correct project', fn: async()=>{
        const d = await projectsApi.getOne('aparna')
        if(d.id!=='aparna') throw new Error('Wrong id: '+d.id)
        return d.name+' — '+d.loc
      }},
    ]
  },
  {
    section: 'Content API — anjana_dashboard',
    tests: [
      { id:'c1', name:'GET /content returns 200', fn: async()=>{
        const d = await contentApi.getAll()
        if(!d._id) throw new Error('No _id in response')
        return 'Content doc: '+d._id
      }},
      { id:'c2', name:'Content has hero section', fn: async()=>{
        const d = await contentApi.getAll()
        if(!d.hero) throw new Error('hero missing')
        return 'hero.headline: '+d.hero.headline
      }},
      { id:'c3', name:'Content has contact section', fn: async()=>{
        const d = await contentApi.getAll()
        if(!d.contact?.phone) throw new Error('contact.phone missing')
        return 'contact.phone: '+d.contact.phone
      }},
    ]
  },
]

const G = { pass:'#1a7a3f', fail:'#b91c1c', idle:'#888', run:'#1d6fb8' }

export default function RegressionTestPage() {
  const total = TESTS.reduce((a,s)=>a+s.tests.length,0)
  const [state, setState] = useState(() => {
    const s={}
    TESTS.forEach(sec=>sec.tests.forEach(t=>{ s[t.id]={status:'idle',msg:'',time:null} }))
    return s
  })
  const [elapsed, setElapsed] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [filter, setFilter] = useState('all')

  const passed = Object.values(state).filter(s=>s.status==='pass').length
  const failed = Object.values(state).filter(s=>s.status==='fail').length
  const running = Object.values(state).some(s=>s.status==='run')

  async function runAll(mode) {
    const t0 = Date.now()
    const allTests = []
    TESTS.forEach(s=>s.tests.forEach(t=>allTests.push(t)))
    const toRun = mode==='failed'
      ? allTests.filter(t=>state[t.id].status==='fail')
      : allTests
    setState(prev=>{
      const next={...prev}
      toRun.forEach(t=>{ next[t.id]={status:'run',msg:'',time:null} })
      return next
    })
    for(const t of toRun){
      const start=Date.now()
      try{
        const msg=await t.fn()
        setState(prev=>({...prev,[t.id]:{status:'pass',msg:msg||'OK',time:Date.now()-start}}))
      }catch(e){
        setState(prev=>({...prev,[t.id]:{status:'fail',msg:e.message,time:Date.now()-start}}))
      }
    }
    setElapsed(((Date.now()-t0)/1000).toFixed(1))
  }

  function icon(status){
    if(status==='pass') return { symbol:'✓', color:G.pass }
    if(status==='fail') return { symbol:'✗', color:G.fail }
    if(status==='run')  return { symbol:'...', color:G.run }
    return { symbol:'○', color:G.idle }
  }

  const pct = total>0 ? Math.round((passed+failed)/total*100) : 0

  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:'2rem 1.5rem',fontFamily:'DM Sans,sans-serif'}}>
      <div style={{marginBottom:'1.5rem'}}>
        <h1 style={{fontSize:22,fontWeight:600,color:'#1a2e1a',marginBottom:4}}>Regression Test Suite</h1>
        <p style={{fontSize:13,color:'#666'}}>Run before merging Development to main — validates all APIs and MongoDB values.</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
        {[['Passed',passed,'#1a7a3f'],['Failed',failed,'#b91c1c'],['Total',total,'#333'],['Duration',elapsed?elapsed+'s':'—','#1d6fb8']].map(([l,v,c])=>(
          <div key={l} style={{background:'#f7f7f5',borderRadius:8,padding:'12px 14px'}}>
            <div style={{fontSize:22,fontWeight:600,color:c}}>{v}</div>
            <div style={{fontSize:12,color:'#888',marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{height:4,background:'#eee',borderRadius:2,marginBottom:16,overflow:'hidden'}}>
        <div style={{height:'100%',width:pct+'%',background:'#1d6fb8',borderRadius:2,transition:'width 0.3s'}} />
      </div>

      <div style={{display:'flex',gap:8,marginBottom:20,alignItems:'center'}}>
        <button onClick={()=>!running&&runAll()} style={{padding:'8px 18px',borderRadius:8,border:'none',background:'#1a4d2e',color:'#fff',cursor:running?'not-allowed':'pointer',fontSize:13,opacity:running?0.7:1}}>
          {running ? 'Running...' : 'Run All Tests'}
        </button>
        <button onClick={()=>!running&&runAll('failed')} style={{padding:'8px 18px',borderRadius:8,border:'1px solid #ddd',background:'#fff',cursor:'pointer',fontSize:13}}>
          Retry Failed
        </button>
        <div style={{marginLeft:'auto',display:'flex',gap:6}}>
          {['all','pass','fail'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:'5px 12px',borderRadius:6,border:'1px solid '+(filter===f?'#333':'#ddd'),background:filter===f?'#f0f0f0':'#fff',fontSize:12,cursor:'pointer',textTransform:'capitalize'}}>
              {f==='all'?'All':f==='pass'?'Passed':'Failed'}
            </button>
          ))}
        </div>
      </div>

      {TESTS.map(section=>{
        const tests=section.tests.filter(t=>{
          if(filter==='pass') return state[t.id].status==='pass'
          if(filter==='fail') return state[t.id].status==='fail'
          return true
        })
        if(!tests.length) return null
        return (
          <div key={section.section} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.5px',textTransform:'uppercase',marginBottom:6}}>{section.section}</div>
            {tests.map(t=>{
              const s=state[t.id]
              const ic=icon(s.status)
              const isOpen=expanded[t.id]
              return (
                <div key={t.id} style={{border:'1px solid #eee',borderRadius:8,marginBottom:4,overflow:'hidden'}}>
                  <div onClick={()=>setExpanded(prev=>({...prev,[t.id]:!prev[t.id]}))}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',cursor:'pointer',background:'#fff'}}>
                    <span style={{width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',background:ic.color,flexShrink:0}}>{ic.symbol}</span>
                    <span style={{fontSize:13,flex:1}}>{t.name}</span>
                    {s.time&&<span style={{fontSize:11,color:'#aaa'}}>{s.time}ms</span>}
                  </div>
                  {isOpen&&s.msg&&(
                    <div style={{padding:'8px 14px 10px 44px',fontSize:12,color:s.status==='fail'?G.fail:G.pass,borderTop:'1px solid #f0f0f0',background:'#fafafa'}}>
                      {s.msg}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
