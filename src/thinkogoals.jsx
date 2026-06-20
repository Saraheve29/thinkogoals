import { useState, useEffect, useRef } from "react";

// ThinkoGoals — Goals · Mind Map · Wipe Out · Decision Maker
// Extracted from Thinko Pro. Standalone mini-app, self-contained (no To Do List / Matrix cross-links).

/* ── PWA INSTALL PROMPT ─────────────────────────────────── */
let deferredInstallPrompt = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
}
const showInstallPrompt = async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return outcome === "accepted";
  }
  return false;
};

/* ═══════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════ */
const C = {
  dp:"#2C3820", mp:"#4A7038", pp:"#6A9058",
  lp:"#A8C5B0", ll:"#D4E4D8", pale:"#F0EBE0",
  wh:"#FFFFFF", txt:"#1A1A10", mid:"#5A5040",
  soft:"#8A8070", done:"#D8D0C0",
};
const MULTI = "linear-gradient(135deg,rgba(230,200,180,0.92) 0%,rgba(210,195,220,0.92) 35%,rgba(190,215,200,0.92) 70%,rgba(220,210,185,0.92) 100%)";
const btnGrad = `linear-gradient(135deg,#3D5A2A,#6A9058)`;

/* ── Shared primitives ─────────────────────────────────── */
function Header({ title, onBack, right }) {
  return (
    <div style={{
      background:MULTI,
      backdropFilter:"blur(16px)",
      WebkitBackdropFilter:"blur(16px)",
      padding:"16px 20px",
      display:"flex",alignItems:"center",gap:12,
      boxShadow:"0 1px 12px rgba(0,0,0,0.06)",
      position:"sticky",top:0,zIndex:50,
      borderBottom:"1px solid rgba(90,120,72,0.1)",
    }}>
      {onBack&&(
        <button onClick={onBack} style={{
          background:"none",color:"#1A1A10",border:"none",
          width:36,height:36,fontSize:22,cursor:"pointer",
          flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
          borderRadius:10,
        }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="#1A1A10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <span style={{flex:1,color:"#1A1A10",fontFamily:"Georgia,serif",fontWeight:700,fontSize:20,textAlign:"center",letterSpacing:0.2}}>{title}</span>
      {right || <div style={{width:36}}/>}
    </div>
  );
}

function GlassCard({ children, style={} }) {
  return (
    <div style={{ background:MULTI, borderRadius:16, padding:"14px", boxShadow:"0 2px 12px rgba(90,80,60,0.09)", border:`1.5px solid ${C.ll}`, ...style }}>
      {children}
    </div>
  );
}

function PurpleBtn({ children, onClick, style={}, small=false }) {
  return (
    <button onClick={onClick} style={{ background:btnGrad, color:"#1A1A10", border:"none", borderRadius:small?8:12, padding:small?"5px 12px":"10px 20px", fontWeight:800, fontSize:small?13:15, cursor:"pointer", boxShadow:"0 3px 12px rgba(90,80,60,0.25)", ...style }}>
      {children}
    </button>
  );
}

/* ── Add to Home Screen / Install button — shown on home screens ── */
function InstallAppButton(){
  const [showTip,setShowTip]=useState(false);
  const isIOS=typeof navigator!=="undefined"&&/iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div style={{padding:"0 16px 4px"}}>
      <button onClick={async()=>{
        const ok=await showInstallPrompt();
        if(!ok)setShowTip(t=>!t);
      }} style={{
        width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,
        padding:"11px",background:"rgba(90,120,72,0.08)",color:"#3A6020",
        border:"1.5px dashed rgba(90,120,72,0.30)",borderRadius:100,
        fontWeight:700,fontSize:13,cursor:"pointer",
      }}>
        📲 Add ThinkoGoals to Home Screen
      </button>
      {showTip&&(
        <div style={{marginTop:8,background:C.wh,borderRadius:14,padding:"12px 14px",border:`1.5px solid ${C.ll}`,fontSize:13,lineHeight:1.6,color:C.txt,textAlign:"center"}}>
          {isIOS
            ?<>Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong> in Safari</>
            :<>In Chrome: tap the <strong>⋮ menu</strong> then <strong>"Install app"</strong> or <strong>"Add to home screen"</strong></>
          }
          <button onClick={()=>setShowTip(false)} style={{display:"block",margin:"8px auto 0",background:"none",border:"none",color:C.soft,fontSize:12,cursor:"pointer"}}>✕ Close</button>
        </div>
      )}
    </div>
  );
}


/* ── Bottom nav — 4 sections ─────────────────────────────── */
function NavBar({ current, setScreen }) {
  const NAV = [
    {id:"home",     icon:"🏠", name:"Home"},
    {id:"goals",    icon:"🎯", name:"Goals"},
    {id:"mindmap",  icon:"🧠", name:"Mind Map"},
    {id:"charge",   icon:"⚡", name:"Wipe Out"},
    {id:"decision", icon:"🎲", name:"Decide"},
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:MULTI,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.6)",zIndex:100,display:"flex",padding:"8px 4px calc(8px + env(safe-area-inset-bottom,0px))"}}>
      {NAV.map(n=>(
        <button key={n.id} onClick={()=>setScreen(n.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 2px",opacity:current===n.id?1:0.55}}>
          <span style={{fontSize:21}}>{n.icon}</span>
          <span style={{fontSize:10,fontWeight:current===n.id?800:600,color:"#1A1A10",fontFamily:"'Segoe UI',sans-serif"}}>{n.name}</span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   🎯 GOALS — horizon-based goal tracker
═══════════════════════════════════════════════════════ */
const GOAL_HORIZONS=[
  {key:"week",  label:"Next Week",  icon:"📅", color:"#5A7848", grad:"linear-gradient(135deg,#e65100,#FF6D00)", question:"What do you want to achieve by next week?",  days:7},
  {key:"month6",label:"6 Months",   icon:"🌱", color:"#27ae60", grad:"linear-gradient(135deg,#1e8449,#27ae60)", question:"Where do you want to be in 6 months?",        days:180},
  {key:"year1", label:"1 Year",     icon:"⭐", color:"#2980b9", grad:"linear-gradient(135deg,#1a5276,#2980b9)", question:"What will you have achieved in 1 year?",       days:365},
  {key:"year3", label:"3 Years",    icon:"🚀", color:"#8e44ad", grad:"linear-gradient(135deg,#4a148c,#8e44ad)", question:"Imagine your life in 3 years — what's changed?",days:1095},
  {key:"year5", label:"5 Years",    icon:"🏔️", color:"#c0392b", grad:"linear-gradient(135deg,#7d1a1a,#c0392b)", question:"What does your ideal life look like in 5 years?",days:1825},
];
const horizonByKey=k=>GOAL_HORIZONS.find(h=>h.key===k)||GOAL_HORIZONS[0];

function mkGoalSubtask(text=""){
  return {id:Date.now()+Math.random(),text,done:false,microSteps:[],microExpanded:false};
}
function mkGoal(horizon){
  const h=horizonByKey(horizon);
  const due=new Date();due.setDate(due.getDate()+h.days);
  return {id:Date.now(),horizon,title:"",description:"",dueDate:due.toISOString().slice(0,10),cover:null,links:[],subtasks:[],status:"active",created:Date.now()};
}

/* ── AI micro-steps — breaks a subtask into tiny actionable steps ── */
async function aiMicroSteps(subtaskText){
  try{
    const res=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-6",
        max_tokens:300,
        messages:[{role:"user",content:`Break this task into 3-5 tiny, concrete, ordered micro-steps a person could do in under 10 minutes each: "${subtaskText}". Respond ONLY with a JSON array of strings, no markdown, no preamble. Example: ["Step one","Step two"]`}]
      })
    });
    const data=await res.json();
    const text=data.content?.[0]?.text||"[]";
    const clean=text.replace(/```json|```/g,"").trim();
    return JSON.parse(clean);
  }catch{return[];}
}

/* ── Goal editor — title, why, links, subtasks, micro-steps ── */
function GoalEditor({goal,onBack,onUpdate,onDelete,onSendToWipeOut}){
  const h=horizonByKey(goal.horizon);
  const [microLoading,setMicroLoading]=useState(null);
  const [newLink,setNewLink]=useState({label:"",url:""});
  const [addingLink,setAddingLink]=useState(false);
  const [newSub,setNewSub]=useState("");
  const [sendMenu,setSendMenu]=useState(null); // subtask id
  const [toast,setToast]=useState("");
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2400);};

  const upd=ch=>onUpdate({...goal,...ch});
  const updSubs=ss=>upd({subtasks:ss});
  const patchSub=(id,ch)=>updSubs(goal.subtasks.map(s=>s.id===id?{...s,...ch}:s));

  const doneCount=goal.subtasks.filter(s=>s.done).length;
  const pct=goal.subtasks.length>0?Math.round((doneCount/goal.subtasks.length)*100):0;

  const handleCover=e=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();r.onload=ev=>upd({cover:ev.target.result});r.readAsDataURL(file);
  };

  const addLink=()=>{
    if(!newLink.url.trim())return;
    upd({links:[...goal.links,{id:Date.now(),label:newLink.label||newLink.url,url:newLink.url}]});
    setNewLink({label:"",url:""});setAddingLink(false);
  };
  const delLink=id=>upd({links:goal.links.filter(l=>l.id!==id)});

  const addSub=()=>{if(!newSub.trim())return;updSubs([...goal.subtasks,mkGoalSubtask(newSub.trim())]);setNewSub("");};
  const delSub=id=>updSubs(goal.subtasks.filter(s=>s.id!==id));
  const toggleSub=id=>patchSub(id,{done:!goal.subtasks.find(s=>s.id===id)?.done});

  const genMicro=async sub=>{
    setMicroLoading(sub.id);
    try{const ms=await aiMicroSteps(sub.text);patchSub(sub.id,{microSteps:ms.map(t=>({id:Date.now()+Math.random(),text:t,done:false})),microExpanded:true});}
    catch{showToast("AI error — try again");}
    setMicroLoading(null);
  };

  const handleSubImg=(id,e)=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();r.onload=ev=>patchSub(id,{image:ev.target.result});r.readAsDataURL(file);
  };

  const sendSub=(sub,dest)=>{
    if(dest==="cal") window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(sub.text)}&details=${encodeURIComponent(goal.title)}`,"_blank");
    else if(dest==="wipeout"&&onSendToWipeOut) onSendToWipeOut(sub.text);
    showToast(" Sent!");setSendMenu(null);
  };

  return(
    <div style={{minHeight:"100vh",background:"transparent",fontFamily:"'Segoe UI',sans-serif",paddingBottom:90}}>

      <div style={{
        background:MULTI,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
        padding:"15px 18px",display:"flex",alignItems:"center",gap:12,
        boxShadow:"0 1px 12px rgba(0,0,0,0.06)",
        position:"sticky",top:0,zIndex:50,
        borderBottom:"1px solid rgba(90,80,60,0.09)",
      }}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,borderRadius:10}}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="#1A1A10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span style={{fontFamily:"Georgia,serif",color:"#1A1A10",fontWeight:700,fontSize:18,flex:1,letterSpacing:-0.2}}>{h.icon} {h.label} Goal</span>
        {goal.subtasks.length>0&&<span style={{color:"#5A7848",fontSize:12,fontWeight:700,background:"rgba(90,120,72,0.12)",padding:"3px 10px",borderRadius:100}}>{pct}%</span>}
        <button onClick={()=>upd({status:goal.status==="done"?"active":"done"})} style={{
          background:goal.status==="done"?"rgba(90,120,72,0.15)":"rgba(248,245,236,0.95)",
          color:goal.status==="done"?"#3A6820":"#1A1A10",
          border:`1.5px solid ${goal.status==="done"?"rgba(90,120,72,0.4)":"rgba(90,80,60,0.2)"}`,
          borderRadius:100,padding:"7px 14px",fontWeight:700,fontSize:13,cursor:"pointer",
        }}>
          {goal.status==="done"?" Done":"Mark done"}
        </button>
        <button onClick={()=>{onDelete(goal.id);}} style={{background:"rgba(192,57,43,0.1)",color:"#c0392b",border:"1px solid rgba(192,57,43,0.2)",borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>🗑</button>
      </div>

      <div style={{padding:"16px 16px"}}>

        <div style={{background:MULTI,borderRadius:22,marginBottom:14,overflow:"hidden",boxShadow:"0 2px 14px rgba(0,0,0,0.06)",border:"1px solid rgba(255,255,255,0.9)"}}>
          {goal.cover?(
            <div style={{position:"relative"}}>
              <img src={goal.cover} alt="" style={{width:"100%",height:180,objectFit:"cover",display:"block",borderRadius:"22px 22px 0 0"}}/>
              <div style={{position:"absolute",bottom:10,right:10,display:"flex",gap:8}}>
                <label style={{background:MULTI,color:"#1A1A10",borderRadius:100,padding:"7px 14px",fontSize:13,fontWeight:700,cursor:"pointer",backdropFilter:"blur(8px)",border:"1px solid rgba(90,80,60,0.2)",display:"flex",alignItems:"center",gap:6}}>
                  📸 Change
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={handleCover}/>
                </label>
                <button onClick={()=>upd({cover:null})} style={{background:"rgba(192,57,43,0.85)",color:"#fff",border:"none",borderRadius:100,padding:"7px 12px",fontSize:13,fontWeight:700,cursor:"pointer"}}>✕</button>
              </div>
            </div>
          ):(
            <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,height:150,
              background:"linear-gradient(135deg,rgba(90,120,72,0.08),rgba(120,160,90,0.06))",
              border:"2px dashed rgba(90,120,72,0.3)",borderRadius:22,cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="linear-gradient(135deg,rgba(90,120,72,0.14),rgba(120,160,90,0.10))"}
              onMouseLeave={e=>e.currentTarget.style.background="linear-gradient(135deg,rgba(90,120,72,0.08),rgba(120,160,90,0.06))"}>
              <div style={{width:58,height:58,borderRadius:16,background:"rgba(90,120,72,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"1.5px solid rgba(90,120,72,0.2)"}}>📸</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#2A3820",marginBottom:3}}>Add a cover photo</div>
                <div style={{fontSize:12,color:"#8A8070"}}>Tap here to upload an image for this goal</div>
              </div>
              <input type="file" accept="image/*" style={{display:"none"}} onChange={handleCover}/>
            </label>
          )}
          {goal.subtasks.length>0&&(
            <div style={{height:5,background:"rgba(90,120,72,0.12)"}}>
              <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#5A7848":"#7A9A60",borderRadius:2,transition:"width 0.4s"}}/>
            </div>
          )}
        </div>

        <div style={{background:MULTI,borderRadius:22,padding:"16px 18px",marginBottom:12,border:"1px solid rgba(255,255,255,0.9)",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
          <div style={{fontFamily:"Georgia,serif",color:"#7A8A6A",fontSize:12,fontWeight:600,marginBottom:8,letterSpacing:0.5}}>{h.question}</div>
          <textarea value={goal.title} onChange={e=>upd({title:e.target.value})} placeholder="Write your goal here…"
            rows={2} style={{width:"100%",boxSizing:"border-box",background:"transparent",border:"none",outline:"none",color:"#1A1A10",fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,resize:"none",lineHeight:1.45}}/>
        </div>

        <div style={{background:MULTI,borderRadius:22,padding:"16px 18px",marginBottom:14,border:"1px solid rgba(255,255,255,0.9)",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#7A8A6A",textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>Why this matters</div>
          <textarea value={goal.description} onChange={e=>upd({description:e.target.value})} placeholder="Your reason, motivation, vision…"
            rows={3} style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",borderRadius:14,border:"1.5px solid rgba(90,120,72,0.15)",fontSize:14,color:"#1A1A10",outline:"none",resize:"none",fontFamily:"inherit",lineHeight:1.55,background:MULTI}}/>
        </div>

        <GlassCard style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:20}}>📅</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:C.soft,marginBottom:4}}>Target date</div>
              <input type="date" value={goal.dueDate||""} onChange={e=>upd({dueDate:e.target.value})}
                style={{border:"none",background:"transparent",fontSize:15,fontWeight:700,color:C.dp,outline:"none",cursor:"pointer"}}/>
            </div>
            <button onClick={()=>window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("🎯 "+goal.title)}&dates=${(goal.dueDate||"").replace(/-/g,"")}/${(goal.dueDate||"").replace(/-/g,"")}`,"_blank")}
              style={{background:"#e8f5e9",color:"#2e7d32",border:"1.5px solid #a5d6a7",borderRadius:10,padding:"7px 13px",fontWeight:700,fontSize:12,cursor:"pointer"}}>
              Add to Calendar
            </button>
          </div>
        </GlassCard>

        <GlassCard style={{marginBottom:14}}>
          <div style={{fontWeight:800,color:C.dp,fontSize:14,marginBottom:8}}>🔗 Links & references</div>
          {goal.links.map(lnk=>(
            <div key={lnk.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7,background:C.pale,borderRadius:10,padding:"8px 10px",border:`1px solid ${C.ll}`}}>
              <span style={{fontSize:14,flexShrink:0}}>🔗</span>
              <span style={{flex:1,fontSize:13,fontWeight:600,color:C.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lnk.label}</span>
              <button onClick={()=>window.open(lnk.url.startsWith("http")?lnk.url:"https://"+lnk.url,"_blank")} style={{background:C.pp,color:"#1A1A10",border:"none",borderRadius:7,width:26,height:26,cursor:"pointer",fontSize:11,flexShrink:0}}>↗</button>
              <button onClick={()=>delLink(lnk.id)} style={{background:"#fce4e4",color:"#c0392b",border:"none",borderRadius:7,width:26,height:26,cursor:"pointer",fontSize:12,flexShrink:0}}>🗑</button>
            </div>
          ))}
          {addingLink?(
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
              <input value={newLink.label} onChange={e=>setNewLink(d=>({...d,label:e.target.value}))} placeholder="Label (e.g. Inspiration article)"
                style={{padding:"8px 12px",borderRadius:10,border:`1.5px solid ${C.lp}`,fontSize:13,color:C.txt,outline:"none"}}/>
              <input value={newLink.url} onChange={e=>setNewLink(d=>({...d,url:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addLink()} placeholder="https://…"
                style={{padding:"8px 12px",borderRadius:10,border:`1.5px solid ${C.lp}`,fontSize:13,color:C.txt,outline:"none"}}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAddingLink(false)} style={{flex:1,background:C.ll,color:C.mid,border:"none",borderRadius:9,padding:"8px",fontWeight:700,cursor:"pointer"}}>Cancel</button>
                <button onClick={addLink} style={{flex:2,background:btnGrad,color:"#1A1A10",border:"none",borderRadius:9,padding:"8px",fontWeight:800,cursor:"pointer"}}>Add</button>
              </div>
            </div>
          ):(
            <button onClick={()=>setAddingLink(true)} style={{width:"100%",padding:"9px",background:"transparent",border:`1.5px dashed ${C.lp}`,borderRadius:10,color:C.pp,fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add link or hyperlink</button>
          )}
        </GlassCard>

        <div style={{marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
          <div style={{color:"#1A1A10",fontWeight:900,fontSize:16,flex:1}}>📋 Subtasks</div>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:12,background:MULTI,borderRadius:12,padding:"9px 13px",border:`1.5px solid ${C.ll}`}}>
          <input value={newSub} onChange={e=>setNewSub(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSub()} placeholder="Add a subtask…"
            style={{flex:1,border:"none",outline:"none",fontSize:14,fontWeight:600,color:C.txt,background:"transparent"}}/>
          <button onClick={addSub} style={{background:btnGrad,color:"#1A1A10",border:"none",borderRadius:9,width:32,height:32,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>+</button>
        </div>

        {goal.subtasks.length===0&&(
          <div style={{textAlign:"center",color:"#9A9080",fontSize:13,fontStyle:"italic",marginBottom:12}}>No subtasks yet — add one above</div>
        )}

        {goal.subtasks.map((sub,si)=>(
          <div key={sub.id} style={{background:MULTI,borderRadius:16,padding:"12px 14px",marginBottom:10,border:`1.5px solid ${sub.done?"#a5d6a7":C.ll}`,opacity:sub.done?0.75:1}}>

            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:8}}>
              <button onClick={()=>toggleSub(sub.id)} style={{width:26,height:26,borderRadius:"50%",border:`2.5px solid ${sub.done?"#27ae60":C.lp}`,background:sub.done?"#27ae60":"transparent",cursor:"pointer",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#1A1A10",fontSize:13,fontWeight:900}}>
                {sub.done?"✓":""}
              </button>
              <div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,rgba(90,120,72,0.18),rgba(74,104,56,0.12))",color:"#1A1A10",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{si+1}</div>
              <div style={{flex:1,fontWeight:700,fontSize:14,color:sub.done?C.soft:C.txt,textDecoration:sub.done?"line-through":"none",lineHeight:1.4}}>{sub.text}</div>
              <button onClick={()=>delSub(sub.id)} style={{background:"transparent",color:"#e74c3c",border:"none",cursor:"pointer",fontSize:15,padding:0}}>🗑</button>
            </div>

            {sub.image&&(
              <div style={{position:"relative",marginBottom:8,marginLeft:58}}>
                <img src={sub.image} alt="" style={{width:"100%",maxHeight:120,objectFit:"cover",borderRadius:10,border:`1.5px solid ${C.ll}`}}/>
                <button onClick={()=>patchSub(sub.id,{image:""})} style={{position:"absolute",top:4,right:4,background:"#e74c3c",color:"#1A1A10",border:"none",borderRadius:"50%",width:20,height:20,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            )}

            {(sub.microSteps||[]).length>0&&sub.microExpanded&&(
              <div style={{marginLeft:58,borderLeft:`3px solid ${C.lp}`,paddingLeft:10,marginBottom:6}}>
                {sub.microSteps.map(ms=>(
                  <div key={ms.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <button onClick={()=>patchSub(sub.id,{microSteps:sub.microSteps.map(m=>m.id===ms.id?{...m,done:!m.done}:m)})} style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${ms.done?"#27ae60":C.lp}`,background:ms.done?"#27ae60":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#1A1A10",fontSize:9}}>
                      {ms.done?"✓":""}
                    </button>
                    <span style={{fontSize:12,color:ms.done?C.soft:C.txt,textDecoration:ms.done?"line-through":"none",flex:1}}>{ms.text}</span>
                  </div>
                ))}
              </div>
            )}
            {(sub.microSteps||[]).length>0&&(
              <button onClick={()=>patchSub(sub.id,{microExpanded:!sub.microExpanded})} style={{marginLeft:58,background:"transparent",border:"none",color:C.soft,fontSize:11,cursor:"pointer",fontWeight:600}}>
                {sub.microExpanded?"▲ Hide micro-steps":"▼ Show micro-steps"}
              </button>
            )}

            <div style={{display:"flex",gap:6,marginTop:8,marginLeft:58,flexWrap:"wrap"}}>
              <label style={{background:C.ll,color:C.mp,borderRadius:8,padding:"4px 9px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                📸 Photo<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleSubImg(sub.id,e)}/>
              </label>
              <button onClick={()=>genMicro(sub)} disabled={microLoading===sub.id} style={{background:"#e8f5e9",color:"#2e7d32",border:"1px solid #a5d6a7",borderRadius:8,padding:"4px 9px",fontSize:11,fontWeight:700,cursor:"pointer",opacity:microLoading===sub.id?0.6:1}}>
                {microLoading===sub.id?"⏳":"🔬 Micro-steps"}
              </button>
              <button onClick={()=>setSendMenu(sendMenu===sub.id?null:sub.id)} style={{background:btnGrad,color:"#1A1A10",border:"none",borderRadius:8,padding:"4px 9px",fontSize:11,fontWeight:700,cursor:"pointer"}}>↗ Send to</button>
            </div>

            {sendMenu===sub.id&&(
              <div style={{marginTop:8,marginLeft:58,background:C.wh,borderRadius:12,border:`1.5px solid ${C.ll}`,overflow:"hidden",boxShadow:"0 4px 16px rgba(90,80,60,0.15)"}}>
                <div style={{padding:"8px 12px",fontSize:11,fontWeight:700,color:C.soft,borderBottom:`1px solid ${C.ll}`,textTransform:"uppercase",letterSpacing:1}}>Send subtask to…</div>
                <button onClick={()=>sendSub(sub,"cal")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"none",border:"none",borderBottom:`1px solid ${C.ll}`,cursor:"pointer",width:"100%",textAlign:"left",fontSize:13,fontWeight:600,color:C.txt}}>📅 Google Calendar</button>
                <button onClick={()=>sendSub(sub,"wipeout")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"none",border:"none",borderBottom:`1px solid ${C.ll}`,cursor:"pointer",width:"100%",textAlign:"left",fontSize:13,fontWeight:600,color:C.txt}}>⚡ The Wipe Out</button>
                <button onClick={()=>setSendMenu(null)} style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",background:"none",border:"none",cursor:"pointer",width:"100%",fontSize:12,color:C.soft}}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {toast&&<div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",background:C.dp,color:"#1A1A10",borderRadius:12,padding:"10px 20px",fontWeight:700,fontSize:14,boxShadow:"0 4px 20px rgba(45,10,94,0.4)",zIndex:400,whiteSpace:"nowrap"}}>{toast}</div>}
    </div>
  );
}

/* ── Goals home — 5 horizon tabs ───────────────────── */
function Goals({data,setData,setScreen,onSendToWipeOut}){
  const [activeHorizon,setActiveHorizon]=useState("week");
  const [detailId,setDetailId]=useState(null);
  const h=horizonByKey(activeHorizon);

  const horizonGoals=data.filter(g=>g.horizon===activeHorizon);
  const detail=data.find(g=>g.id===detailId);

  if(detail) return(
    <GoalEditor
      goal={detail}
      onBack={()=>setDetailId(null)}
      onUpdate={u=>setData(ds=>ds.map(g=>g.id===u.id?u:g))}
      onDelete={id=>{setData(ds=>ds.filter(g=>g.id!==id));setDetailId(null);}}
      onSendToWipeOut={onSendToWipeOut}
    />
  );

  const addGoal=()=>{
    const g=mkGoal(activeHorizon);
    setData(ds=>[...ds,g]);
    setDetailId(g.id);
  };

  return(
    <div style={{minHeight:"100vh",background:"transparent",fontFamily:"'Segoe UI',sans-serif",paddingBottom:90}}>

      <div style={{
        background:MULTI,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
        padding:"22px 20px 18px",textAlign:"center",
        borderBottom:"1px solid rgba(90,80,60,0.08)",
        position:"sticky",top:0,zIndex:50,
      }}>
        <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#1A1A10",letterSpacing:-0.5,display:"inline-flex",alignItems:"center",gap:10}}>
          Smart Goals <span style={{fontSize:22}}>♥</span>
        </div>
      </div>

      <div style={{padding:"18px 20px 8px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          {[{key:"week",label:"Next Week"},{key:"month6",label:"6 Months"}].map(({key,label})=>(
            <button key={key} onClick={()=>setActiveHorizon(key)} style={{
              background:MULTI,
              border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)",
              borderRadius:18,padding:"18px 12px",cursor:"pointer",transition:"all 0.15s",position:"relative",
              boxShadow:activeHorizon===key?"0 2px 14px rgba(90,80,60,0.12)":"none",
            }}>
              <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:activeHorizon===key?700:500,color:activeHorizon===key?"#1A1A10":"#7A7060",textAlign:"center"}}>{label}</div>
              {activeHorizon===key&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:40,height:3,background:"#2A1A08",borderRadius:2}}/>}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
          {[{key:"year1",label:"1 Year"},{key:"year3",label:"3 Years"},{key:"year5",label:"5 Years"}].map(({key,label})=>(
            <button key={key} onClick={()=>setActiveHorizon(key)} style={{
              background:MULTI,
              border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)",
              borderRadius:18,padding:"16px 8px",cursor:"pointer",transition:"all 0.15s",position:"relative",
              boxShadow:activeHorizon===key?"0 2px 14px rgba(90,80,60,0.12)":"none",
            }}>
              <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:activeHorizon===key?700:500,color:activeHorizon===key?"#1A1A10":"#7A7060",textAlign:"center"}}>{label}</div>
              {activeHorizon===key&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:32,height:3,background:"#2A1A08",borderRadius:2}}/>}
            </button>
          ))}
        </div>

        <button onClick={addGoal} style={{
          width:"100%",padding:"19px 24px",
          background:"linear-gradient(135deg,rgba(230,200,180,0.85) 0%,rgba(210,195,220,0.85) 40%,rgba(190,215,200,0.85) 70%,rgba(220,210,185,0.85) 100%)",
          color:"#2A1A08",border:"1.5px solid rgba(180,160,140,0.35)",borderRadius:100,
          fontFamily:"Georgia,serif",fontWeight:600,fontSize:18,cursor:"pointer",marginBottom:32,
          boxShadow:"0 4px 24px rgba(90,80,60,0.12)",backdropFilter:"blur(8px)",
          display:"flex",alignItems:"center",justifyContent:"center",gap:14,letterSpacing:0.2,transition:"all 0.15s",
        }}>
          <span style={{fontSize:22,fontWeight:300}}>+</span>
          Add {h.label} Goal
        </button>

        {horizonGoals.length===0&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 0 24px"}}>
            <svg width="60" height="72" viewBox="0 0 60 72" fill="none" style={{marginBottom:20}}>
              <defs>
                <linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#A8E068"/><stop offset="100%" stopColor="#5A9830"/></linearGradient>
                <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#C8F098"/><stop offset="100%" stopColor="#78B848"/></linearGradient>
                <filter id="sgf"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1A3A08" floodOpacity="0.2"/></filter>
              </defs>
              <path d="M30 70 Q30 50 30 35" stroke="#5A8830" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <g filter="url(#sgf)">
                <path d="M30 38 Q18 28 14 18 Q22 16 30 26 Q30 32 30 38Z" fill="url(#sg1)"/>
                <path d="M30 38 Q22 30 14 18" stroke="#3A7820" strokeWidth="0.8" opacity="0.18"/>
              </g>
              <g filter="url(#sgf)">
                <path d="M30 42 Q42 30 46 18 Q38 17 30 28 Q30 35 30 42Z" fill="url(#sg2)"/>
                <path d="M30 42 Q38 32 46 18" stroke="#3A7820" strokeWidth="0.8" opacity="0.18"/>
              </g>
              <g filter="url(#sgf)" opacity="0.85">
                <path d="M30 52 Q22 44 19 36 Q25 35 30 44 Q30 48 30 52Z" fill="url(#sg2)"/>
                <path d="M30 52 Q24 46 19 36" stroke="#3A7820" strokeWidth="0.65" opacity="0.18"/>
              </g>
              <ellipse cx="30" cy="70" rx="8" ry="2.5" fill="#C8A870" opacity="0.35"/>
            </svg>
            <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#2A1A08",textAlign:"center",lineHeight:1.55,maxWidth:260,fontWeight:500}}>
              {h.question}
            </div>
          </div>
        )}

        {horizonGoals.map(goal=>{
          const doneCount=goal.subtasks.filter(s=>s.done).length;
          const pct=goal.subtasks.length>0?Math.round((doneCount/goal.subtasks.length)*100):0;
          return(
            <div key={goal.id} onClick={()=>setDetailId(goal.id)}
              style={{
                background:MULTI,borderRadius:22,marginBottom:12,overflow:"hidden",
                boxShadow:"0 3px 18px rgba(90,80,60,0.09)",
                border:"1.5px solid rgba(255,255,255,0.9)",
                cursor:"pointer",transition:"transform 0.15s",
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              {goal.cover&&<img src={goal.cover} alt="" style={{width:"100%",height:80,objectFit:"cover"}}/>}
              {goal.subtasks.length>0&&(
                <div style={{height:4,background:"rgba(90,80,60,0.1)"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#5A7848":h.color,borderRadius:2,transition:"width 0.4s"}}/>
                </div>
              )}
              <div style={{padding:"14px 18px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:goal.status==="done"?"#9A9080":"#1A1A10",textDecoration:goal.status==="done"?"line-through":"none",marginBottom:4,lineHeight:1.4}}>
                      {goal.title||"(Tap to edit)"}
                    </div>
                    {goal.description&&<div style={{fontSize:12,color:"#8A8070",lineHeight:1.5,marginBottom:4}}>{goal.description.slice(0,70)}{goal.description.length>70?"…":""}</div>}
                    <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                      {goal.dueDate&&<span style={{fontSize:11,color:"#7A7060",fontWeight:600}}>📅 {new Date(goal.dueDate).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>}
                      {goal.subtasks.length>0&&<span style={{fontSize:11,color:"#7A7060",fontWeight:600}}>{doneCount}/{goal.subtasks.length} steps · {pct}%</span>}
                      {goal.links.length>0&&<span style={{fontSize:11,color:"#7A7060"}}>🔗 {goal.links.length}</span>}
                    </div>
                  </div>
                  <span style={{fontSize:22,flexShrink:0}}>{h.icon}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <NavBar current="goals" setScreen={setScreen}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   🧠 MIND MAP
═══════════════════════════════════════════════════════ */
const NODE_COLORS=["#9b59b6","#c2185b","#e67e22","#27ae60","#2980b9","#1abc9c","#e74c3c","#f39c12","#8e44ad","#16a085"];
const BRANCH_COLORS=["#c4aee8","#f48fb1","#ffcc80","#a5d6a7","#90caf9","#80cbc4","#ef9a9a","#ffe082","#ce93d8","#80deea"];

/* Crystal (root) node SVG renderer */
function CrystalNode({cx,cy,r,selected,label,isRoot}) {
  const id=`crys_${cx|0}_${cy|0}`;
  return (
    <g style={{cursor:"pointer",filter:selected?"drop-shadow(0 0 10px rgba(160,190,140,0.35))":"drop-shadow(0 4px 8px rgba(45,10,94,0.5))"}}>
      <defs>
        <radialGradient id={`rg_${id}`} cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#f0e8ff" stopOpacity="1"/>
          <stop offset="28%"  stopColor="#c4aee8" stopOpacity="0.95"/>
          <stop offset="60%"  stopColor="#7c5cbf" stopOpacity="0.92"/>
          <stop offset="85%"  stopColor="#5a3d9a" stopOpacity="0.97"/>
          <stop offset="100%" stopColor="#2C3820" stopOpacity="1"/>
        </radialGradient>
        <radialGradient id={`shine_${id}`} cx="32%" cy="28%" r="40%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.75)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id={`glow_${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c4aee8" stopOpacity={selected?0.6:0.2}/>
          <stop offset="100%" stopColor="#7c5cbf" stopOpacity="0"/>
        </radialGradient>
        <clipPath id={`clip_${id}`}>
          <circle cx={cx} cy={cy} r={r}/>
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r+8} fill={`url(#glow_${id})`}/>
      {selected&&<circle cx={cx} cy={cy} r={r+5} fill="none" stroke="rgba(160,190,140,0.35)" strokeWidth={2} strokeDasharray="6,3"/>}
      <circle cx={cx} cy={cy} r={r} fill={`url(#rg_${id})`} stroke="rgba(255,255,255,0.5)" strokeWidth={selected?2.5:1.5}/>
      <g clipPath={`url(#clip_${id})`} opacity={0.25}>
        <line x1={cx-r} y1={cy-r*0.2} x2={cx+r} y2={cy+r*0.2} stroke="white" strokeWidth={0.8}/>
        <line x1={cx-r*0.3} y1={cy-r} x2={cx+r*0.3} y2={cy+r} stroke="white" strokeWidth={0.8}/>
        <line x1={cx-r*0.8} y1={cy+r*0.5} x2={cx+r*0.8} y2={cy-r*0.5} stroke="white" strokeWidth={0.6}/>
        <line x1={cx} y1={cy-r} x2={cx-r*0.6} y2={cy+r*0.6} stroke="white" strokeWidth={0.5}/>
        <line x1={cx} y1={cy-r} x2={cx+r*0.6} y2={cy+r*0.6} stroke="white" strokeWidth={0.5}/>
      </g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#shine_${id})`}/>
      <circle cx={cx-r*0.28} cy={cy-r*0.3} r={r*0.13} fill="rgba(255,255,255,0.7)"/>
      <circle cx={cx-r*0.18} cy={cy-r*0.18} r={r*0.06} fill="rgba(255,255,255,0.9)"/>
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={isRoot?13:10} fontWeight={800}
        style={{pointerEvents:"none",userSelect:"none",textShadow:"0 1px 4px rgba(0,0,0,0.6)"}}>
        {label.length>12?label.slice(0,11)+"…":label}
      </text>
    </g>
  );
}

/* Branch (child) node SVG renderer */
function BranchNode({cx,cy,r,color,lightColor,selected,label}) {
  const id=`br_${cx|0}_${cy|0}_${label.slice(0,4)}`;
  return (
    <g style={{cursor:"pointer",filter:selected?"drop-shadow(0 0 8px rgba(255,255,255,0.6))":"drop-shadow(0 2px 6px rgba(45,10,94,0.4))"}}>
      <defs>
        <radialGradient id={`brg_${id}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor={lightColor} stopOpacity="1"/>
          <stop offset="50%"  stopColor={color} stopOpacity="0.95"/>
          <stop offset="100%" stopColor={color} stopOpacity="1"/>
        </radialGradient>
        <radialGradient id={`bshine_${id}`} cx="30%" cy="25%" r="40%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.6)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <clipPath id={`bclip_${id}`}><circle cx={cx} cy={cy} r={r}/></clipPath>
      </defs>
      {selected&&<circle cx={cx} cy={cy} r={r+5} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeDasharray="5,3"/>}
      <circle cx={cx} cy={cy} r={r} fill={`url(#brg_${id})`} stroke="rgba(255,255,255,0.4)" strokeWidth={selected?2:1.2}/>
      <g clipPath={`url(#bclip_${id})`} opacity={0.2}>
        <line x1={cx-r} y1={cy} x2={cx+r} y2={cy} stroke="white" strokeWidth={0.7}/>
        <line x1={cx} y1={cy-r} x2={cx} y2={cy+r} stroke="white" strokeWidth={0.7}/>
      </g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#bshine_${id})`}/>
      <circle cx={cx-r*0.25} cy={cy-r*0.28} r={r*0.12} fill="rgba(255,255,255,0.65)"/>
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={10} fontWeight={700}
        style={{pointerEvents:"none",userSelect:"none"}}>
        {label.length>11?label.slice(0,10)+"…":label}
      </text>
    </g>
  );
}

/* Send-to dropdown — multi-select, sends to Goals, Wipe Out, or Calendar */
function SendToDropdown({node,isRoot,setGoalsData,onSendToWipeOut,addToCalendar,sentMsg,setSentMsg}){
  const [open,setOpen]=useState(false);
  const [selected,setSelected]=useState(new Set());
  const ref=useRef(null);

  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  const horizons=["week","month1","month6","year1","year3","year5"];
  const horizonLabels={"week":"Next Week","month1":"1 Month","month6":"6 Months","year1":"1 Year","year3":"3 Years","year5":"5 Years"};
  const horizonIcons={"week":"📅","month1":"🗓️","month6":"🌱","year1":"⭐","year3":"🚀","year5":"🏔️"};
  const horizonDays={"week":7,"month1":30,"month6":180,"year1":365,"year3":1095,"year5":1825};

  // Root node: Goals + Calendar. Branch nodes: Wipe Out + Calendar.
  const OPTIONS=isRoot?[
    {id:"cal",       label:"Google Calendar",       icon:"📅", group:"📅 Calendar"},
    ...horizons.map(h=>({id:`goal_${h}`,label:`${horizonLabels[h]} Goal`,icon:horizonIcons[h],group:"🎯 Add as Goal"})),
  ]:[
    {id:"cal",       label:"Google Calendar",       icon:"📅", group:"📅 Calendar"},
    {id:"wipeout",   label:"The Wipe Out",          icon:"⚡", group:"⚡ Wipe Out"},
  ];

  const groups=[...new Set(OPTIONS.map(o=>o.group))];
  const toggle=id=>setSelected(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});

  const sendAll=()=>{
    if(selected.size===0)return;
    const text=node.text;
    const note=node.note||"";
    const msgs=[];

    selected.forEach(id=>{
      if(id==="cal"){
        addToCalendar();
        msgs.push("📅 Calendar");
      }
      else if(id==="wipeout"){
        if(onSendToWipeOut)onSendToWipeOut(text);
        msgs.push("⚡ Wipe Out");
      }
      else if(id.startsWith("goal_")){
        const horizon=id.replace("goal_","");
        const due=new Date();
        due.setDate(due.getDate()+(horizonDays[horizon]||7));
        const newGoal={
          id:Date.now()+Math.random(),
          horizon:horizon==="month1"?"month6":horizon,
          title:text,description:note,
          dueDate:due.toISOString().slice(0,10),
          cover:node.cover||null,
          links:(node.links||[]).map(l=>({...l,id:Date.now()+Math.random()})),
          subtasks:[],status:"active",created:Date.now()
        };
        newGoal._horizonLabel=horizonLabels[horizon];
        newGoal._horizonIcon=horizonIcons[horizon];
        if(setGoalsData) setGoalsData(gs=>[...gs,newGoal]);
        msgs.push(`${horizonIcons[horizon]} Goal`);
      }
    });

    setSentMsg(" Sent to: "+[...new Set(msgs)].join(", "));
    setTimeout(()=>setSentMsg(""),3000);
    setSelected(new Set());setOpen(false);
  };

  return(
    <div style={{marginBottom:16,position:"relative"}} ref={ref}>
      <div style={{fontWeight:800,color:C.dp,fontSize:14,marginBottom:8}}>
        {isRoot?"🎯 Add to Goals or Calendar":"↗ Send to Wipe Out / Calendar"}
      </div>

      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",background:open?C.ll:C.pale,border:`2px solid ${open?C.pp:C.lp}`,borderRadius:12,fontWeight:700,fontSize:14,color:C.dp,cursor:"pointer",transition:"all 0.15s"}}>
        <span>{selected.size===0?"Choose destinations…":`${selected.size} selected`}</span>
        <span style={{fontSize:12,color:C.soft}}>{open?"▲":"▼"}</span>
      </button>

      {open&&(
        <div style={{position:"absolute",bottom:"calc(100% + 8px)",left:0,right:0,background:C.wh,borderRadius:16,border:`1.5px solid ${C.lp}`,boxShadow:"0 -8px 32px rgba(90,80,60,0.22)",zIndex:400,maxHeight:340,overflowY:"auto"}}>
          {groups.map(group=>{
            const opts=OPTIONS.filter(o=>o.group===group);
            if(!opts.length)return null;
            return(
              <div key={group}>
                <div style={{padding:"8px 14px 4px",fontSize:10,fontWeight:800,color:C.soft,textTransform:"uppercase",letterSpacing:1,background:C.pale,borderBottom:`1px solid ${C.ll}`}}>
                  {group}
                </div>
                {opts.map(opt=>{
                  const isSel=selected.has(opt.id);
                  return(
                    <button key={opt.id} onClick={()=>toggle(opt.id)}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:isSel?"#f0ebff":"transparent",border:"none",borderBottom:`1px solid ${C.ll}`,cursor:"pointer",width:"100%",textAlign:"left"}}>
                      <span style={{fontSize:18,flexShrink:0}}>{opt.icon}</span>
                      <span style={{flex:1,fontSize:14,fontWeight:isSel?700:600,color:isSel?C.pp:C.txt}}>{opt.label}</span>
                      <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${isSel?C.pp:C.lp}`,background:isSel?C.pp:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {isSel&&<span style={{color:"#1A1A10",fontSize:12,fontWeight:900,lineHeight:1}}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
          <div style={{padding:"12px 14px",position:"sticky",bottom:0,background:C.wh,borderTop:`1.5px solid ${C.ll}`}}>
            <button onClick={sendAll} disabled={selected.size===0}
              style={{width:"100%",padding:"12px",background:selected.size>0?btnGrad:"#ccc",color:"#1A1A10",border:"none",borderRadius:12,fontWeight:800,fontSize:14,cursor:selected.size>0?"pointer":"default",transition:"all 0.2s"}}>
              {selected.size===0?"Select destinations above":`Send to ${selected.size} place${selected.size>1?"s":""} →`}
            </button>
          </div>
        </div>
      )}

      {sentMsg&&(
        <div style={{marginTop:8,background:"#e8f5e9",color:"#2e7d32",borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:700,lineHeight:1.5}}>
          {sentMsg}
        </div>
      )}
    </div>
  );
}

/* ── Mind Map home — list of maps, create new ─────────── */
function MindMap({data,setData,setGoalsData,onSendToWipeOut,setScreen}) {
  const [mapId,setMapId]=useState(null);
  const [adding,setAdding]=useState(false);
  const [name,setName]=useState("");
  const [newCover,setNewCover]=useState(null);
  const [newLink,setNewLink]=useState("");
  const inputRef=useRef(null);
  useEffect(()=>{if(adding&&inputRef.current)inputRef.current.focus();},[adding]);

  const map=data.find(m=>m.id===mapId);

  const makeRootNode=(text,cx,cy)=>({id:Date.now(),text,x:cx,y:cy,parent:null,color:"crystal",cover:newCover,links:newLink.trim()?[{id:Date.now()+1,label:newLink.trim(),url:newLink.trim()}]:[]});
  const submit=()=>{
    if(!name.trim())return;
    setData(ms=>[...ms,{id:Date.now(),name:name.trim(),nodes:[makeRootNode(name.trim(),0,0)]}]);
    setName("");setNewCover(null);setNewLink("");setAdding(false);
  };

  if(map) return <MindMapCanvas map={map} onBack={()=>setMapId(null)} onUpdate={u=>setData(ms=>ms.map(m=>m.id===u.id?u:m))} setGoalsData={setGoalsData} onSendToWipeOut={onSendToWipeOut}/>;

  return (
    <div style={{minHeight:"100vh",background:"transparent",fontFamily:"'Segoe UI',sans-serif",paddingBottom:90}}>
      <Header title="Mind Map" onBack={()=>setScreen("home")} right={
        <button onClick={()=>setAdding(true)} style={{background:"#5A7848",color:"#fff",border:"none",borderRadius:50,width:40,height:40,fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,boxShadow:"0 3px 12px rgba(58,80,38,0.35)"}}>+</button>
      }/>
      <div style={{padding:"20px 16px"}}>

        {adding&&(
          <div style={{background:MULTI,borderRadius:24,padding:"20px 18px",marginBottom:18,boxShadow:"0 4px 24px rgba(0,0,0,0.1)",border:"1px solid rgba(90,120,72,0.2)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#5A7848",textTransform:"uppercase",letterSpacing:1.4,marginBottom:12}}>New Mind Map</div>
            <input ref={inputRef} value={name} onChange={e=>setName(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")submit();if(e.key==="Escape"){setAdding(false);setName("");}}}
              placeholder="Central topic..." style={{width:"100%",boxSizing:"border-box",padding:"13px 16px",borderRadius:100,border:"1.5px solid rgba(90,120,72,0.3)",fontSize:15,fontWeight:600,color:"#1A1A10",outline:"none",marginBottom:12,background:MULTI}}/>
            {newCover?(
              <div style={{position:"relative",marginBottom:12}}>
                <img src={newCover} alt="" style={{width:"100%",height:100,objectFit:"cover",borderRadius:14,border:"1.5px solid rgba(90,120,72,0.2)"}}/>
                <button onClick={()=>setNewCover(null)} style={{position:"absolute",top:6,right:6,background:"rgba(192,57,43,0.9)",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ):(
              <label style={{display:"flex",alignItems:"center",gap:8,padding:"11px 16px",background:"rgba(90,120,72,0.06)",border:"1.5px dashed rgba(90,120,72,0.3)",borderRadius:14,cursor:"pointer",fontSize:13,fontWeight:600,color:"#5A7848",marginBottom:12}}>
                📸 Add cover photo
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>setNewCover(ev.target.result);r.readAsDataURL(file);}}/>
              </label>
            )}
            <div style={{display:"flex",gap:10,marginBottom:16,background:"rgba(255,255,255,0.8)",borderRadius:100,padding:"10px 16px",border:"1.5px solid rgba(90,120,72,0.15)"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,opacity:0.45,alignSelf:"center"}}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#3A3020" strokeWidth="2" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#3A3020" strokeWidth="2" strokeLinecap="round"/></svg>
              <input value={newLink} onChange={e=>setNewLink(e.target.value)} placeholder="Add a link (optional)"
                style={{flex:1,border:"none",fontSize:13,color:"#1A1A10",outline:"none",background:"transparent"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <button onClick={()=>{setAdding(false);setName("");setNewCover(null);setNewLink("");}} style={{background:"transparent",color:"#8A8070",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",padding:"8px 16px"}}>Cancel</button>
              <button onClick={submit} style={{background:"#5A7848",color:"#fff",border:"none",borderRadius:100,padding:"10px 24px",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:"0 3px 12px rgba(58,80,38,0.3)"}}>Create Map</button>
            </div>
          </div>
        )}

        {data.length===0&&!adding&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 16px 0"}}>
            <svg width="240" height="180" viewBox="0 0 240 180" fill="none" style={{marginBottom:6,overflow:"visible"}}>
              <defs>
                <linearGradient id="mg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#C8EC98"/><stop offset="100%" stopColor="#5A8830"/></linearGradient>
                <linearGradient id="mg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#A8D870"/><stop offset="100%" stopColor="#4A7820"/></linearGradient>
                <linearGradient id="mg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D8F0A8"/><stop offset="100%" stopColor="#78B040"/></linearGradient>
                <linearGradient id="mgn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8A9E78"/><stop offset="100%" stopColor="#5A7848"/></linearGradient>
                <filter id="mgs"><feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#1A3A08" floodOpacity="0.25"/></filter>
              </defs>
              <path d="M10 180 Q8 140 16 105 Q22 76 12 45 Q8 28 18 10" stroke="#7A6030" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d="M230 180 Q232 140 224 105 Q218 76 228 45 Q232 28 222 10" stroke="#7A6030" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <g filter="url(#mgs)"><path d="M14 30 Q-4 16 -12 26 Q-14 40 2 46 Q14 48 14 30Z" fill="url(#mg1)"/><line x1="14" y1="30" x2="2" y2="46" stroke="#3A6820" strokeWidth="0.8" opacity="0.18"/><line x1="8" y1="38" x2="2" y2="46" stroke="#3A6820" strokeWidth="0.5" opacity="0.14"/><line x1="8" y1="38" x2="14" y2="44" stroke="#3A6820" strokeWidth="0.5" opacity="0.14"/></g>
              <g filter="url(#mgs)"><path d="M16 62 Q-2 50 -10 60 Q-12 74 4 80 Q16 81 16 62Z" fill="url(#mg2)"/><line x1="16" y1="62" x2="4" y2="80" stroke="#3A6820" strokeWidth="0.75" opacity="0.18"/></g>
              <g filter="url(#mgs)"><path d="M14 96 Q-4 84 -12 94 Q-14 108 2 114 Q14 115 14 96Z" fill="url(#mg3)"/><line x1="14" y1="96" x2="2" y2="114" stroke="#3A6820" strokeWidth="0.72" opacity="0.18"/></g>
              <g filter="url(#mgs)"><path d="M18 130 Q0 118 -8 128 Q-10 142 6 148 Q18 149 18 130Z" fill="url(#mg1)"/><line x1="18" y1="130" x2="6" y2="148" stroke="#3A6820" strokeWidth="0.7" opacity="0.18"/></g>
              <g filter="url(#mgs)"><path d="M16 160 Q-2 148 -10 158 Q-12 172 4 178 Q16 179 16 160Z" fill="url(#mg2)"/></g>
              <g filter="url(#mgs)"><path d="M226 30 Q244 16 252 26 Q254 40 238 46 Q226 48 226 30Z" fill="url(#mg1)"/><line x1="226" y1="30" x2="238" y2="46" stroke="#3A6820" strokeWidth="0.8" opacity="0.18"/><line x1="232" y1="38" x2="238" y2="46" stroke="#3A6820" strokeWidth="0.5" opacity="0.14"/><line x1="232" y1="38" x2="226" y2="44" stroke="#3A6820" strokeWidth="0.5" opacity="0.14"/></g>
              <g filter="url(#mgs)"><path d="M224 62 Q242 50 250 60 Q252 74 236 80 Q224 81 224 62Z" fill="url(#mg2)"/><line x1="224" y1="62" x2="236" y2="80" stroke="#3A6820" strokeWidth="0.75" opacity="0.18"/></g>
              <g filter="url(#mgs)"><path d="M226 96 Q244 84 252 94 Q254 108 238 114 Q226 115 226 96Z" fill="url(#mg3)"/><line x1="226" y1="96" x2="238" y2="114" stroke="#3A6820" strokeWidth="0.72" opacity="0.18"/></g>
              <g filter="url(#mgs)"><path d="M222 130 Q240 118 248 128 Q250 142 234 148 Q222 149 222 130Z" fill="url(#mg1)"/><line x1="222" y1="130" x2="234" y2="148" stroke="#3A6820" strokeWidth="0.7" opacity="0.18"/></g>
              <g filter="url(#mgs)"><path d="M224 160 Q242 148 250 158 Q252 172 236 178 Q224 179 224 160Z" fill="url(#mg2)"/></g>
              <path d="M18 12 Q60 -10 120 -8 Q180 -10 222 12" stroke="#8A7040" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>
              <g filter="url(#mgs)"><path d="M55 4 Q50 -14 64 -20 Q78 -18 80 -2 Q78 10 66 10 Q55 8 55 4Z" fill="url(#mg3)"/><line x1="55" y1="4" x2="66" y2="10" stroke="#3A6820" strokeWidth="0.7" opacity="0.18"/></g>
              <g filter="url(#mgs)"><path d="M95 -2 Q92 -20 106 -24 Q120 -22 120 -6 Q118 6 106 6 Q95 4 95 -2Z" fill="url(#mg1)"/><line x1="95" y1="-2" x2="106" y2="6" stroke="#3A6820" strokeWidth="0.68" opacity="0.18"/></g>
              <g filter="url(#mgs)"><path d="M145 -2 Q148 -20 162 -24 Q176 -22 174 -6 Q172 6 160 6 Q147 4 145 -2Z" fill="url(#mg2)"/></g>
              <g filter="url(#mgs)"><path d="M182 4 Q186 -14 200 -20 Q214 -18 212 -2 Q210 10 198 10 Q184 8 182 4Z" fill="url(#mg3)"/></g>
              <rect x="82" y="76" width="76" height="30" rx="15" fill="url(#mgn)" filter="url(#mgs)"/>
              <text x="120" y="91" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="700" style={{fontFamily:"Georgia,serif"}}>Your Ideas</text>
              <path d="M82 91 C60 91 44 68 38 60" stroke="#7A9068" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8"/>
              <ellipse cx="62" cy="78" rx="5" ry="8" fill="url(#mg2)" opacity="0.85" transform="rotate(-30 62 78)"/>
              <line x1="62" y1="83" x2="62" y2="71" stroke="#3A7820" strokeWidth="0.6" opacity="0.18"/>
              <path d="M82 84 C58 76 44 52 40 42" stroke="#7A9068" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8"/>
              <ellipse cx="60" cy="64" rx="4" ry="7" fill="url(#mg1)" opacity="0.85" transform="rotate(-40 60 64)"/>
              <path d="M158 91 C178 91 194 68 202 60" stroke="#7A9068" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8"/>
              <ellipse cx="178" cy="78" rx="5" ry="8" fill="url(#mg3)" opacity="0.85" transform="rotate(30 178 78)"/>
              <line x1="178" y1="83" x2="178" y2="71" stroke="#3A7820" strokeWidth="0.6" opacity="0.18"/>
              <path d="M158 84 C182 76 196 52 200 42" stroke="#7A9068" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8"/>
              <ellipse cx="180" cy="64" rx="4" ry="7" fill="url(#mg2)" opacity="0.85" transform="rotate(40 180 64)"/>
              <path d="M120 106 C120 126 120 140 120 152" stroke="#7A9068" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8"/>
              <ellipse cx="120" cy="130" rx="5" ry="8" fill="url(#mg1)" opacity="0.85" transform="rotate(5 120 130)"/>
              <rect x="18" y="52" width="52" height="22" rx="11" fill="rgba(248,245,236,0.92)" stroke="rgba(90,120,72,0.35)" strokeWidth="1.2" filter="url(#mgs)"/>
              <text x="44" y="63" textAnchor="middle" dominantBaseline="middle" fill="#2A3A18" fontSize="9.5" fontWeight="600">Thoughts</text>
              <rect x="16" y="30" width="52" height="22" rx="11" fill="rgba(248,245,236,0.92)" stroke="rgba(90,120,72,0.35)" strokeWidth="1.2" filter="url(#mgs)"/>
              <text x="42" y="41" textAnchor="middle" dominantBaseline="middle" fill="#2A3A18" fontSize="9.5" fontWeight="600">Projects</text>
              <rect x="172" y="52" width="52" height="22" rx="11" fill="url(#mgn)" filter="url(#mgs)"/>
              <text x="198" y="63" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9.5" fontWeight="600">Goals</text>
              <rect x="170" y="30" width="52" height="22" rx="11" fill="rgba(248,245,236,0.92)" stroke="rgba(90,120,72,0.35)" strokeWidth="1.2" filter="url(#mgs)"/>
              <text x="196" y="41" textAnchor="middle" dominantBaseline="middle" fill="#2A3A18" fontSize="9.5" fontWeight="600">Ideas</text>
              <rect x="90" y="147" width="60" height="22" rx="11" fill="rgba(248,245,236,0.92)" stroke="rgba(90,120,72,0.35)" strokeWidth="1.2" filter="url(#mgs)"/>
              <text x="120" y="158" textAnchor="middle" dominantBaseline="middle" fill="#2A3A18" fontSize="9.5" fontWeight="600">Plans</text>
            </svg>

            <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#1A3010",textAlign:"center",marginBottom:10,letterSpacing:-0.4,lineHeight:1.25,textShadow:"0 1px 3px rgba(255,255,255,0.6)"}}>
              Think visually, think freely
            </div>
            <div style={{background:MULTI,borderRadius:20,padding:"18px 20px",marginBottom:24,border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)",maxWidth:320,textAlign:"center"}}>
              <div style={{fontSize:18,color:"#1A2810",lineHeight:1.65,fontWeight:800,fontFamily:"Georgia,serif"}}>
                Create multiple mind maps — one for each project, idea, or dream.
              </div>
              <div style={{fontSize:15,color:"#3A2A18",lineHeight:1.6,fontWeight:600,marginTop:8}}>
                Let your thoughts branch naturally, like vines finding the light. 🌿
              </div>
            </div>
            <button onClick={()=>setAdding(true)} style={{
              background:"#5A7848",color:"#fff",border:"none",
              borderRadius:100,padding:"17px 40px",
              fontSize:17,fontWeight:700,cursor:"pointer",
              boxShadow:"0 6px 24px rgba(58,80,38,0.38)",
              display:"flex",alignItems:"center",gap:12,
              letterSpacing:0.2,marginBottom:16,
            }}>
              <span style={{fontSize:20}}>+</span>
              Create your first mind map
            </button>
            <div style={{fontSize:12,color:"rgba(90,80,60,0.55)",textAlign:"center",display:"flex",alignItems:"center",gap:6}}>
              <span>🌿</span>
              <span>You can create as many maps as you like</span>
              <span>🌿</span>
            </div>
          </div>
        )}

        {data.length>0&&(
          <div style={{fontSize:11,color:"rgba(60,50,30,0.45)",textAlign:"center",marginBottom:12,letterSpacing:0.5}}>
            Tap a map to open it
          </div>
        )}
        {data.map((m,i)=>{
          const cols=["#5A7848","#7A6038","#486878","#6A5870","#486050"];
          const col=cols[i%cols.length];
          return(
            <div key={m.id} onClick={()=>setMapId(m.id)}
              style={{display:"flex",alignItems:"center",gap:14,background:MULTI,backdropFilter:"blur(12px)",borderRadius:22,padding:"16px 18px",marginBottom:12,border:"1px solid rgba(255,255,255,0.9)",cursor:"pointer",transition:"all 0.15s",boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
              <div style={{width:44,height:44,borderRadius:14,flexShrink:0,background:col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 2px 10px ${col}55`}}>🧠</div>
              <div style={{flex:1}}>
                <div style={{color:"#1A1A10",fontWeight:700,fontSize:17,marginBottom:2}}>{m.name}</div>
                <div style={{color:"#8A8070",fontSize:12}}>{m.nodes.length} node{m.nodes.length!==1?"s":""}</div>
              </div>
              <button onClick={e=>{e.stopPropagation();setData(ms=>ms.filter(x=>x.id!==m.id));}}
                style={{background:"rgba(90,80,60,0.08)",color:"#8A8070",border:"1px solid rgba(90,80,60,0.15)",borderRadius:10,width:34,height:34,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🗑</button>
            </div>
          );
        })}
      </div>
      <NavBar current="mindmap" setScreen={setScreen}/>
    </div>
  );
}

/* ── Mind Map canvas — the actual branching diagram editor ── */
function MindMapCanvas({map,onBack,onUpdate,setGoalsData,onSendToWipeOut}) {
  const svgRef=useRef(null);

  const [nodes,setNodes]=useState(map.nodes);
  const [selected,setSelected]=useState(null);
  const [dragging,setDragging]=useState(null);
  const [dragMoved,setDragMoved]=useState(false);
  const [dragOffset,setDragOffset]=useState({x:0,y:0});
  const [editingId,setEditingId]=useState(null);
  const [editText,setEditText]=useState("");
  const [pan,setPan]=useState({x:0,y:0});
  const [scale,setScale]=useState(1);
  const [panStart,setPanStart]=useState(null);
  const [sentMsg,setSentMsg]=useState("");
  const [deleteConfirmId,setDeleteConfirmId]=useState(null);
  const longPressRef=useRef(null);

  function NodeColourDot({color,onSelect}) {
    const [open,setOpen]=useState(false);
    const ref=useRef(null);
    useEffect(()=>{
      const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
      document.addEventListener("mousedown",h);
      return()=>document.removeEventListener("mousedown",h);
    },[]);
    return (
      <div ref={ref} style={{position:"relative",flexShrink:0}}>
        <button onClick={()=>setOpen(o=>!o)} style={{width:36,height:36,borderRadius:"50%",background:color,border:`3px solid ${open?C.dp:C.lp}`,cursor:"pointer",padding:0,boxShadow:open?`0 0 0 3px ${C.lp}`:"none",transition:"all 0.15s"}}/>
        {open&&(
          <div style={{position:"absolute",bottom:42,right:0,background:C.wh,borderRadius:14,padding:"10px 8px",boxShadow:"0 8px 28px rgba(90,80,60,0.28)",border:`1.5px solid ${C.ll}`,display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,zIndex:300}}>
            {NODE_COLORS.map((col,i)=>(
              <button key={col} onClick={()=>{onSelect(col,i);setOpen(false);}} style={{width:30,height:30,borderRadius:"50%",background:col,border:color===col?`3px solid ${C.dp}`:"2px solid rgba(0,0,0,0.08)",cursor:"pointer",padding:0,transition:"transform 0.1s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  const [svgSize,setSvgSize]=useState({w:360,h:500});

  useEffect(()=>{onUpdate({...map,nodes});},[nodes]);

  useEffect(()=>{
    if(!svgRef.current)return;
    const obs=new ResizeObserver(([e])=>{
      setSvgSize({w:e.contentRect.width,h:e.contentRect.height});
      setNodes(ns=>ns.map(n=>n.parent===null&&n.x===0&&n.y===0?{...n,x:e.contentRect.width/2,y:e.contentRect.height/2}:n));
    });
    obs.observe(svgRef.current);
    return()=>obs.disconnect();
  },[]);

  const getPos=(e)=>{
    const r=svgRef.current.getBoundingClientRect();
    const touch=e.touches?e.touches[0]:e;
    return{x:touch.clientX-r.left-pan.x, y:touch.clientY-r.top-pan.y};
  };

  const hitTest=(pos)=>{
    return nodes.slice().reverse().find(n=>{
      const isRoot=!n.parent;
      if(isRoot){
        return Math.abs(pos.x-n.x)<60&&Math.abs(pos.y-n.y)<70;
      }
      return Math.abs(pos.x-n.x)<50&&Math.abs(pos.y-n.y)<22;
    });
  };

  const spawnChild=(parentId)=>{
    const parent=nodes.find(n=>n.id===parentId);
    if(!parent)return;
    const siblings=nodes.filter(n=>n.parent===parentId);
    const isRoot=parent.parent===null;
    const xOff = isRoot ? 200 : 180;
    const ySpread = 54;
    const totalSibs = siblings.length;
    const newY = parent.y + (totalSibs - Math.max(0,totalSibs-1)/2) * ySpread - (totalSibs * ySpread/2);
    const colorIdx=nodes.filter(n=>n.parent!==null).length%NODE_COLORS.length;
    const newNode={
      id:Date.now(), text:"New idea",
      x:parent.x+xOff,
      y:newY,
      parent:parentId,
      color:NODE_COLORS[colorIdx],
      lightColor:BRANCH_COLORS[colorIdx],
    };
    setNodes(ns=>[...ns,newNode]);
    setSelected(newNode.id);
    setTimeout(()=>{setEditingId(newNode.id);setEditText("New idea");},60);
  };

  const commitEdit=()=>{
    if(!editText.trim())return;
    setNodes(ns=>ns.map(n=>n.id===editingId?{...n,text:editText.trim()}:n));
    setEditingId(null);
  };

  const onDown=e=>{
    const pos=getPos(e);
    const hit=hitTest(pos);
    if(hit){
      setDragging(hit.id);
      setDragMoved(false);
      setDragOffset({x:pos.x-hit.x,y:pos.y-hit.y});
    } else {
      setSelected(null);
      const touch=e.touches?e.touches[0]:e;
      setPanStart({x:touch.clientX-pan.x,y:touch.clientY-pan.y});
    }
  };

  const onMove=e=>{
    e.preventDefault();
    clearTimeout(longPressRef.current);
    if(dragging){
      const pos=getPos(e);
      setDragMoved(true);
      setNodes(ns=>ns.map(n=>n.id===dragging?{...n,x:pos.x-dragOffset.x,y:pos.y-dragOffset.y}:n));
    } else if(panStart){
      const touch=e.touches?e.touches[0]:e;
      setPan({x:touch.clientX-panStart.x,y:touch.clientY-panStart.y});
    }
  };

  const onUp=()=>{
    if(dragging&&!dragMoved){
      if(selected===dragging) spawnChild(dragging);
      else setSelected(dragging);
    }
    setDragging(null);
    setPanStart(null);
  };

  const onDblClick=e=>{
    const pos=getPos(e);
    const hit=hitTest(pos);
    if(hit){setEditingId(hit.id);setEditText(hit.text);}
  };

  const edgePath=(p,ch)=>{
    const x1=p.parent===null?p.x+55:p.x+45;
    const x2=ch.x-48;
    const mx=(x1+x2)/2;
    return`M${x1} ${p.y} C${mx} ${p.y} ${mx} ${ch.y} ${x2} ${ch.y}`;
  };

  const root=nodes.find(n=>n.parent===null);

  return (
    <div style={{minHeight:"100vh",background:"transparent",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",paddingBottom:70}}>
      <div style={{position:"absolute",top:0,left:0,zIndex:50,padding:"16px"}}>
        <button onClick={onBack} style={{width:44,height:44,borderRadius:"50%",background:MULTI,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",backdropFilter:"blur(8px)"}}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="#1A1A10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div style={{position:"fixed",bottom:80,right:16,zIndex:60,display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={()=>setScale(s=>Math.min(3,s+0.2))} style={{width:44,height:44,borderRadius:"50%",background:MULTI,border:"1.5px solid rgba(90,120,72,0.25)",cursor:"pointer",fontSize:22,fontWeight:700,boxShadow:"0 2px 12px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
        <button onClick={()=>setScale(s=>Math.max(0.3,s-0.2))} style={{width:44,height:44,borderRadius:"50%",background:MULTI,border:"1.5px solid rgba(90,120,72,0.25)",cursor:"pointer",fontSize:22,fontWeight:700,boxShadow:"0 2px 12px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
        <button onClick={()=>{setScale(1);setPan({x:0,y:0});}} style={{width:44,height:44,borderRadius:"50%",background:"rgba(90,120,72,0.15)",border:"1.5px solid rgba(90,120,72,0.30)",cursor:"pointer",fontSize:14,fontWeight:700,boxShadow:"0 2px 12px rgba(0,0,0,0.10)",display:"flex",alignItems:"center",justifyContent:"center",color:"#3A6020"}}>↺</button>
      </div>

      <div style={{flex:1,overflow:"hidden",position:"relative"}}>
        <svg ref={svgRef} width="100%" height="100%"
          style={{position:"absolute",inset:0,touchAction:"none"}}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          onDoubleClick={onDblClick}>

          <defs>
            <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7A9068"/>
              <stop offset="100%" stopColor="#5A7848"/>
            </linearGradient>
            <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A9E78"/>
              <stop offset="100%" stopColor="#607850"/>
            </linearGradient>
            <linearGradient id="leafG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8D070"/>
              <stop offset="100%" stopColor="#5A8830"/>
            </linearGradient>
            <filter id="nodeSh" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1A2E08" floodOpacity="0.18"/>
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="transparent"/>

          <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>

            {nodes.filter(n=>n.parent).map(n=>{
              const p=nodes.find(x=>x.id===n.parent);
              if(!p)return null;
              const isSel=n.id===selected||p.id===selected;
              const d=edgePath(p,n);
              const x1=p.parent===null?p.x+55:p.x+45;
              const x2=n.x-48;
              const mx=(x1+x2)/2;
              const my=(p.y+n.y)/2;
              return(
                <g key={`e${n.id}`}>
                  <path d={d} fill="none"
                    stroke={isSel?"#5A7848":"#7A9068"}
                    strokeWidth={isSel?2.5:2} strokeLinecap="round"
                    opacity={isSel?1:0.75}
                  />
                  <g transform={`translate(${mx},${my})`}>
                    <ellipse cx="0" cy="-7" rx="5" ry="9" fill="url(#leafG)" opacity="0.85" transform="rotate(-20)"/>
                    <line x1="0" y1="-2" x2="0" y2="-13" stroke="#3A7820" strokeWidth="0.7" opacity="0.18"/>
                    <ellipse cx="8" cy="-3" rx="4" ry="7" fill="url(#leafG)" opacity="0.75" transform="rotate(15)"/>
                  </g>
                </g>
              );
            })}

            {root&&(()=>{
              const isSel=root.id===selected;
              const rx=root.x, ry=root.y;
              const W=root.text.length>14?160:140, H=46;
              return(
                <g key={root.id} style={{cursor:"pointer"}}
                  onClick={()=>{if(selected===root.id){spawnChild(root.id);}else setSelected(root.id);}}
                  onDoubleClick={()=>{setEditingId(root.id);setEditText(root.text);}}>
                  <rect x={rx-W/2+2} y={ry-H/2+3} width={W} height={H} rx={H/2} fill="rgba(0,0,0,0.14)" filter="url(#nodeSh)"/>
                  <rect x={rx-W/2} y={ry-H/2} width={W} height={H} rx={H/2}
                    fill="url(#rootGrad)"
                    stroke={isSel?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.3)"}
                    strokeWidth={isSel?2.5:1.5}/>
                  <text x={rx} y={ry} textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize={root.text.length>16?12:14} fontWeight={700}
                    style={{pointerEvents:"none",userSelect:"none"}}>
                    {root.text.length>18?root.text.slice(0,17)+"…":root.text}
                  </text>
                  <g transform={`translate(${rx},${ry-H/2-8})`}>
                    <ellipse cx="0" cy="-6" rx="4" ry="7" fill="url(#leafG)" opacity="0.9" transform="rotate(-10)"/>
                    <ellipse cx="6" cy="-4" rx="3" ry="5" fill="url(#leafG)" opacity="0.75" transform="rotate(20)"/>
                    <line x1="0" y1="0" x2="0" y2="-12" stroke="#3A7820" strokeWidth="0.8" opacity="0.18"/>
                  </g>
                </g>
              );
            })()}

            {nodes.filter(n=>n.parent!==null).map(n=>{
              const isSel=n.id===selected;
              const W=n.text.length>16?180:n.text.length>10?150:120, H=44;
              const hasIcon=n.icon;
              return(
                <g key={n.id} style={{cursor:"pointer"}}
                  onClick={()=>{if(selected===n.id){spawnChild(n.id);}else setSelected(n.id);}}
                  onDoubleClick={()=>{setEditingId(n.id);setEditText(n.text);}}
                  onContextMenu={e=>{e.preventDefault();setDeleteConfirmId(n.id);}}>
                  <rect x={n.x-W/2+1} y={n.y-H/2+2} width={W} height={H} rx={H/2} fill="rgba(0,0,0,0.12)" filter="url(#nodeSh)"/>
                  <rect x={n.x-W/2} y={n.y-H/2} width={W} height={H} rx={H/2}
                    fill={"url(#nodeGrad)"}
                    stroke={isSel?"rgba(255,255,255,0.7)":"rgba(90,120,72,0.35)"}
                    strokeWidth={1.5}/>
                  {hasIcon&&(
                    <>
                      <circle cx={n.x-W/2+20} cy={n.y} r={14}
                        fill={isSel?"rgba(255,255,255,0.2)":"rgba(248,245,236,0.95)"}
                        stroke={isSel?"rgba(255,255,255,0.4)":"rgba(90,120,72,0.2)"} strokeWidth={1}/>
                      <text x={n.x-W/2+20} y={n.y} textAnchor="middle" dominantBaseline="middle"
                        fontSize={12} style={{pointerEvents:"none",userSelect:"none"}}>{n.icon}</text>
                    </>
                  )}
                  <text
                    x={hasIcon?n.x+10:n.x} y={n.y}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="#1A2E10" fontSize={16} fontWeight={800}
                    style={{pointerEvents:"none",userSelect:"none"}}>
                    {n.text}
                  </text>
                  {n.url&&(
                    <text x={n.x+W/2-14} y={n.y} textAnchor="middle" dominantBaseline="middle"
                      fontSize={10} style={{pointerEvents:"none"}}>🔗</text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {nodes.length===1&&!selected&&(
          <div style={{position:"absolute",top:"58%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",color:"rgba(90,80,60,0.55)",fontSize:14,pointerEvents:"none",fontFamily:"Georgia,serif",lineHeight:1.6}}>
            Tap the central node<br/>to add your first branch
          </div>
        )}
      </div>

      <div style={{
        padding:"12px 12px 28px",
        display:"flex",gap:8,alignItems:"center",
        background:MULTI,
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        borderTop:"1px solid rgba(255,255,255,0.6)",
        boxShadow:"0 -2px 16px rgba(0,0,0,0.06)",
        overflowX:"auto",
        scrollbarWidth:"none",
        flexShrink:0,
      }}>
        <button onClick={()=>{if(selected)spawnChild(selected);else if(root)spawnChild(root.id);}}
          style={{
            background:"#5A7848",color:"white",
            border:"none",borderRadius:100,
            padding:"11px 18px",
            fontSize:14,fontWeight:700,cursor:"pointer",
            display:"flex",alignItems:"center",gap:7,
            whiteSpace:"nowrap",flexShrink:0,
            boxShadow:"0 2px 10px rgba(58,80,38,0.28)",
          }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg>
          Add Node
        </button>
        <button onClick={()=>{if(editingId||selected){setEditingId(selected||editingId);setEditText(nodes.find(n=>n.id===(selected||editingId))?.text||"");}}}
          style={{background:MULTI,color:"#3A3020",border:"1.5px solid rgba(90,120,72,0.2)",borderRadius:100,padding:"11px 18px",fontSize:14,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
          Attach
        </button>
      </div>

      {deleteConfirmId&&(()=>{
        const delNode=nodes.find(n=>n.id===deleteConfirmId);
        if(!delNode)return null;
        return(
          <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(10,2,30,0.75)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
            <div style={{background:C.wh,borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:360,textAlign:"center",boxShadow:"0 8px 40px rgba(45,10,94,0.5)"}}>
              <div style={{fontSize:36,marginBottom:12}}>🗑</div>
              <div style={{fontWeight:900,color:C.dp,fontSize:17,marginBottom:8}}>Delete this node?</div>
              <div style={{color:C.soft,fontSize:14,marginBottom:20,lineHeight:1.5}}>"{delNode.text}" and all its children will be removed.</div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setDeleteConfirmId(null)} style={{flex:1,background:C.ll,color:C.mp,border:`1.5px solid ${C.lp}`,borderRadius:12,padding:"12px",fontWeight:800,fontSize:14,cursor:"pointer"}}>← Keep</button>
                <button onClick={()=>{
                  const toDelete=new Set();
                  const collect=(id)=>{toDelete.add(id);nodes.filter(n=>n.parent===id).forEach(n=>collect(n.id));};
                  collect(deleteConfirmId);
                  setNodes(ns=>ns.filter(n=>!toDelete.has(n.id)));
                  setDeleteConfirmId(null);
                }} style={{flex:1,background:"#e74c3c",color:"#1A1A10",border:"none",borderRadius:12,padding:"12px",fontWeight:800,fontSize:14,cursor:"pointer"}}>Delete</button>
              </div>
            </div>
          </div>
        );
      })()}

      {editingId&&(()=>{
        const node=nodes.find(n=>n.id===editingId);
        if(!node)return null;
        const isRoot=node.parent===null;
        const updateColor=(col,i)=>setNodes(ns=>ns.map(n=>n.id===editingId?{...n,color:col,lightColor:BRANCH_COLORS[i]}:n));
        const patchNode=ch=>setNodes(ns=>ns.map(n=>n.id===editingId?{...n,...ch}:n));

        const handleCover=(e)=>{
          const file=e.target.files[0];if(!file)return;
          const r=new FileReader();r.onload=ev=>patchNode({cover:ev.target.result});r.readAsDataURL(file);
        };

        const links=node.links||[];
        const addLink=()=>patchNode({links:[...links,{id:Date.now(),label:"",url:""}]});
        const patchLink=(id,ch)=>patchNode({links:links.map(l=>l.id===id?{...l,...ch}:l)});
        const delLink=id=>patchNode({links:links.filter(l=>l.id!==id)});

        const images=node.images||[];
        const handleImg=(e)=>{
          const file=e.target.files[0];if(!file)return;
          const r=new FileReader();r.onload=ev=>patchNode({images:[...images,{id:Date.now(),src:ev.target.result}]});r.readAsDataURL(file);
        };
        const delImg=id=>patchNode({images:images.filter(img=>img.id!==id)});

        const addToCalendar=()=>window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(node.text)}`,"_blank");

        const accentCol=isRoot?C.pp:(node.color||NODE_COLORS[0]);

        return (
          <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}
            onClick={e=>{if(e.target===e.currentTarget)setEditingId(null);}}>
            <div style={{position:"absolute",inset:0,background:"rgba(10,2,30,0.65)"}} onClick={()=>setEditingId(null)}/>

            <div style={{position:"relative",background:C.wh,borderRadius:"22px 22px 0 0",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(58,80,38,0.20)"}}>
              <div style={{display:"flex",justifyContent:"center",padding:"10px 0 6px"}}><div style={{width:40,height:4,borderRadius:2,background:C.ll}}/></div>

              <div style={{position:"relative",height:node.cover?180:90,background:node.cover?"transparent":`linear-gradient(135deg,${accentCol},${C.dp})`,borderRadius:"22px 22px 0 0",overflow:"hidden",flexShrink:0}}>
                {node.cover&&<img src={node.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                {!node.cover&&(
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",gap:8}}>
                    <span style={{fontSize:32,opacity:0.4}}>📸</span>
                    <span style={{color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700}}>Add cover photo</span>
                  </div>
                )}
                <button onClick={()=>setEditingId(null)} style={{position:"absolute",top:10,left:10,background:"rgba(0,0,0,0.45)",color:"#1A1A10",border:"none",borderRadius:10,width:36,height:36,fontSize:18,cursor:"pointer",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,zIndex:10}}>←</button>
                <div style={{position:"absolute",top:10,right:10,display:"flex",gap:8}}>
                  <label style={{background:"rgba(0,0,0,0.45)",color:"#1A1A10",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",backdropFilter:"blur(4px)"}}>
                    📸 {node.cover?"Change":"Add photo"}
                    <input type="file" accept="image/*" style={{display:"none"}} onChange={handleCover}/>
                  </label>
                  {node.cover&&<button onClick={()=>patchNode({cover:null})} style={{background:"rgba(192,57,43,0.7)",color:"#1A1A10",border:"none",borderRadius:20,padding:"5px 10px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✕</button>}
                </div>
                <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.4)"}}/>
              </div>

              <div style={{padding:"16px 18px 30px"}}>

                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <input value={editText} onChange={e=>setEditText(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")commitEdit();}}
                    autoFocus
                    placeholder="Topic title…"
                    style={{flex:1,padding:"10px 14px",borderRadius:11,border:`2px solid ${C.lp}`,fontSize:16,fontWeight:700,color:C.txt,outline:"none"}}/>
                  {!isRoot&&(
                    <NodeColourDot color={node.color||NODE_COLORS[0]} onSelect={(col,i)=>updateColor(col,i)}/>
                  )}
                </div>

                <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"flex-start"}}>
                  <span style={{fontSize:18,marginTop:2}}>≡</span>
                  <textarea
                    value={node.note||""}
                    onChange={e=>patchNode({note:e.target.value})}
                    placeholder="Add more detailed information…"
                    rows={3}
                    style={{flex:1,padding:"10px 13px",borderRadius:11,border:`1.5px solid ${C.ll}`,fontSize:14,color:C.txt,outline:"none",resize:"none",fontFamily:"inherit",lineHeight:1.6,background:C.pale}}
                  />
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:800,color:C.dp,fontSize:14,marginBottom:8}}>🔗 Links</div>
                  {links.map(lnk=>(
                    <div key={lnk.id} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center",background:C.pale,borderRadius:10,padding:"8px 10px",border:`1.5px solid ${C.ll}`}}>
                      <input value={lnk.label} onChange={e=>patchLink(lnk.id,{label:e.target.value})}
                        placeholder="Label (e.g. Instagram)"
                        style={{flex:"0 0 100px",border:"none",background:"transparent",fontSize:13,fontWeight:600,color:C.txt,outline:"none"}}/>
                      <div style={{width:1,height:20,background:C.ll,flexShrink:0}}/>
                      <input value={lnk.url} onChange={e=>patchLink(lnk.id,{url:e.target.value})}
                        placeholder="https://…"
                        style={{flex:1,border:"none",background:"transparent",fontSize:12,color:C.mid,outline:"none"}}/>
                      {lnk.url&&(
                        <button onClick={()=>window.open(lnk.url.startsWith("http")?lnk.url:"https://"+lnk.url,"_blank")}
                          style={{background:C.pp,color:"#1A1A10",border:"none",borderRadius:7,width:26,height:26,cursor:"pointer",fontSize:11,flexShrink:0}}>↗</button>
                      )}
                      <button onClick={()=>delLink(lnk.id)} style={{background:"#fce4e4",color:"#c0392b",border:"none",borderRadius:7,width:26,height:26,cursor:"pointer",fontSize:12,flexShrink:0}}>🗑</button>
                    </div>
                  ))}
                  <button onClick={addLink} style={{width:"100%",padding:"8px",background:"transparent",border:`1.5px dashed ${C.lp}`,borderRadius:10,color:C.pp,fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add link</button>
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:800,color:C.dp,fontSize:14,marginBottom:8}}>📎 Attachments</div>
                  {images.length>0&&(
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                      {images.map(img=>(
                        <div key={img.id} style={{position:"relative"}}>
                          <img src={img.src} alt="" style={{width:80,height:80,objectFit:"cover",borderRadius:10,border:`2px solid ${C.ll}`}}/>
                          <button onClick={()=>delImg(img.id)} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:"#e74c3c",color:"#1A1A10",border:"none",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",background:C.pale,border:`1.5px dashed ${C.lp}`,borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,color:C.pp}}>
                    📸 Upload image
                    <input type="file" accept="image/*" style={{display:"none"}} onChange={handleImg}/>
                  </label>
                </div>

                <SendToDropdown
                  node={node}
                  isRoot={isRoot}
                  setGoalsData={setGoalsData}
                  onSendToWipeOut={onSendToWipeOut}
                  addToCalendar={addToCalendar}
                  sentMsg={sentMsg} setSentMsg={setSentMsg}
                />

                <div style={{display:"flex",gap:10,marginBottom:8}}>
                  <button onClick={()=>setEditingId(null)} style={{flex:1,background:C.ll,color:C.mp,border:`1.5px solid ${C.lp}`,borderRadius:12,padding:"13px",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>← Back</button>
                  <button onClick={commitEdit} style={{flex:2,background:btnGrad,color:"#1A1A10",border:"none",borderRadius:12,padding:"13px",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 3px 12px rgba(45,10,94,0.3)"}}>Save</button>
                </div>
                {!isRoot&&(
                  <button onClick={()=>{
                    const toDelete=new Set();
                    const collect=(id)=>{toDelete.add(id);nodes.filter(n=>n.parent===id).forEach(n=>collect(n.id));};
                    collect(editingId);
                    setNodes(ns=>ns.filter(n=>!toDelete.has(n.id)));
                    setEditingId(null);
                  }} style={{width:"100%",padding:"12px",background:"#fce4e4",color:"#c0392b",border:"1.5px solid #f1948a",borderRadius:12,fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    🗑 Delete this node
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ⚡ THE WIPE OUT — daily task burndown challenge
═══════════════════════════════════════════════════════ */
function OrbOfLight({pct=0,size=130}){
  const cx=size/2,cy=size/2,maxR=size*0.36;
  const coreR=Math.max(size*0.05,maxR*(pct/100));
  const full=pct>=100;
  const col=pct===0?"#3d1a6e":pct<40?"#7c5cbf":pct<80?"#c4aee8":"#fff";
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:"block",overflow:"visible"}}>
      <defs>
        <radialGradient id="og" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor={full?"#fff":pct>50?"#e0d0ff":"#9060c0"}/>
          <stop offset="100%" stopColor={full?"#c4aee8":"#2C3820"}/>
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation={pct>60?5:2.5}/></filter>
      </defs>
      {pct>0&&Array.from({length:10}).map((_,i)=>{
        const a=(i/10)*Math.PI*2,d=coreR+6,len=maxR*(0.25+0.6*(pct/100));
        return <line key={i} x1={cx+Math.cos(a)*d} y1={cy+Math.sin(a)*d} x2={cx+Math.cos(a)*(d+len)} y2={cy+Math.sin(a)*(d+len)} stroke={full?"#fff":"#c4aee8"} strokeWidth={full?2:1} strokeLinecap="round" opacity={Math.min(0.8,(pct-25)/75)*0.7}/>;
      })}
      <circle cx={cx} cy={cy} r={Math.max(coreR,size*0.04)} fill="url(#og)"/>
      {full&&[0,60,120,180,240,300].map((d,i)=>{
        const r=d*Math.PI/180;
        return <circle key={i} cx={cx+Math.cos(r)*maxR*1.15} cy={cy+Math.sin(r)*maxR*1.15} r={3.5} fill="#FFD700"/>;
      })}
    </svg>
  );
}

function WipeOutMonster({pct=0,size=160,timerOn=false}){
  const defeated=pct>=100;
  const hp=1-(pct/100);
  const anger=hp;

  const r=Math.round(220-anger*30+hp*20);
  const g=Math.round(80+hp*20+(1-anger)*60);
  const b=Math.round(40+(1-anger)*120);
  const bodyCol=`rgb(${r},${g},${b})`;
  const darkCol=`rgb(${Math.round(r*0.65)},${Math.round(g*0.65)},${Math.round(b*0.65)})`;
  const eyeGlow=anger>0.5?"#FF2200":anger>0.2?"#FF8800":"#88BB66";
  const brow=anger>0.5?"#660000":anger>0.2?"#994400":"#336622";

  const stage=pct===0?"😤 FULL POWER":pct<25?"💢 RAGING":pct<50?"😠 WEAKENING":pct<75?"😨 SCARED":"💀 NEARLY DONE";

  return(
    <div style={{textAlign:"center",position:"relative",width:size,margin:"0 auto"}}>
      <style>{`
        @keyframes monsterBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes monsterRage{0%,100%{transform:rotate(-2deg) scale(1)}50%{transform:rotate(2deg) scale(1.04)}}
        @keyframes eyePulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes sparkFloat{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}
        @keyframes wipeOut{0%{transform:scale(1);opacity:1}100%{transform:scale(0);opacity:0}}
      `}</style>

      {defeated&&["✨","💥","⭐","🌟","💫","✨"].map((e,i)=>(
        <div key={i} style={{position:"absolute",top:"30%",left:"50%",fontSize:18,
          "--dx":`${(i%2===0?1:-1)*(20+i*12)}px`,
          "--dy":`${-30-i*10}px`,
          animation:"sparkFloat 0.8s ease-out forwards",
          animationDelay:`${i*0.08}s`,
          pointerEvents:"none",zIndex:10}}>
          {e}
        </div>
      ))}

      <svg
        width={size} height={size*1.2}
        viewBox="0 0 120 140"
        style={{
          display:"block",margin:"0 auto",overflow:"visible",
          opacity:defeated?0:0.35+hp*0.65,
          animation:defeated?"wipeOut 0.6s ease-out forwards":
            timerOn&&hp>0.3?"monsterRage 0.7s ease-in-out infinite":
            hp>0.1?"monsterBob 2.5s ease-in-out infinite":"none",
        }}>
        <defs>
          <radialGradient id="mBody" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={`rgb(${Math.min(255,r+40)},${Math.min(255,g+30)},${Math.min(255,b+20)})`}/>
            <stop offset="100%" stopColor={darkCol}/>
          </radialGradient>
          <radialGradient id="mBelly" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(255,240,220,0.45)"/>
            <stop offset="100%" stopColor="rgba(255,220,180,0.10)"/>
          </radialGradient>
          <radialGradient id="mEye" cx="30%" cy="25%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
            <stop offset="100%" stopColor="rgba(200,200,200,0.6)"/>
          </radialGradient>
          <filter id="mGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={anger>0.6?3:1.5} result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="mShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={anger>0.5?"rgba(180,0,0,0.4)":"rgba(0,80,40,0.2)"}/>
          </filter>
        </defs>

        <ellipse cx="60" cy="132" rx={20*hp+8} ry={5*hp+2} fill="rgba(0,0,0,0.12)"/>
        <ellipse cx="60" cy="90" rx="28" ry="34" fill="url(#mBody)" filter="url(#mShadow)"/>
        <ellipse cx="60" cy="96" rx="16" ry="20" fill="url(#mBelly)"/>

        <ellipse cx="46" cy="120" rx="9" ry="8" fill={darkCol}/>
        <ellipse cx="74" cy="120" rx="9" ry="8" fill={darkCol}/>
        <ellipse cx="44" cy="126" rx="11" ry="6" fill={bodyCol}/>
        <ellipse cx="76" cy="126" rx="11" ry="6" fill={bodyCol}/>
        <circle cx="37" cy="127" r="3.5" fill={darkCol}/>
        <circle cx="44" cy="130" r="3.5" fill={darkCol}/>
        <circle cx="51" cy="128" r="3" fill={darkCol}/>
        <circle cx="69" cy="127" r="3.5" fill={darkCol}/>
        <circle cx="76" cy="130" r="3.5" fill={darkCol}/>
        <circle cx="83" cy="128" r="3" fill={darkCol}/>

        <path d={`M34 82 Q${18-anger*6} ${70+anger*6} ${26+anger*2} ${62-anger*4}`} stroke={bodyCol} strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d={`M86 82 Q${102+anger*6} ${70+anger*6} ${94-anger*2} ${62-anger*4}`} stroke={bodyCol} strokeWidth="11" strokeLinecap="round" fill="none"/>
        {hp>0.25&&<>
          <path d="M24 61 Q18 54 16 58" stroke={darkCol} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M26 58 Q22 50 24 47" stroke={darkCol} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M30 56 Q28 48 31 46" stroke={darkCol} strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M96 61 Q102 54 104 58" stroke={darkCol} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M94 58 Q98 50 96 47" stroke={darkCol} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M90 56 Q92 48 89 46" stroke={darkCol} strokeWidth="3" strokeLinecap="round" fill="none"/>
        </>}

        <ellipse cx="60" cy="52" rx="26" ry="24" fill="url(#mBody)" filter="url(#mShadow)"/>

        <path d={`M42 33 Q${32-hp*4} ${16-hp*8} ${38-hp*2} ${26-hp*3}`}
          stroke={darkCol} strokeWidth="7" strokeLinecap="round" fill="none"/>
        <path d={`M42 33 Q${30-hp*6} ${12-hp*10} ${36-hp*3} ${22-hp*4}`}
          stroke={bodyCol} strokeWidth="4" strokeLinecap="round" fill="none"/>
        {anger>0.4&&<circle cx={34-anger*3} cy={14-anger*6} r="3" fill="#FF4400" opacity={anger*0.8} style={{animation:"eyePulse 1s ease-in-out infinite"}}/>}

        <path d={`M78 33 Q${88+hp*4} ${16-hp*8} ${82+hp*2} ${26-hp*3}`}
          stroke={darkCol} strokeWidth="7" strokeLinecap="round" fill="none"/>
        <path d={`M78 33 Q${90+hp*6} ${12-hp*10} ${84+hp*3} ${22-hp*4}`}
          stroke={bodyCol} strokeWidth="4" strokeLinecap="round" fill="none"/>
        {anger>0.4&&<circle cx={86+anger*3} cy={14-anger*6} r="3" fill="#FF4400" opacity={anger*0.8} style={{animation:"eyePulse 1s ease-in-out infinite"}}/>}

        <ellipse cx="48" cy="50" rx="7" ry={5+anger*3} fill="url(#mEye)"/>
        <ellipse cx="72" cy="50" rx="7" ry={5+anger*3} fill="url(#mEye)"/>
        <ellipse cx="48" cy="50" rx={anger>0.5?2.5:4} ry={anger>0.5?4.5:3.5} fill={eyeGlow} filter="url(#mGlow)"/>
        <ellipse cx="72" cy="50" rx={anger>0.5?2.5:4} ry={anger>0.5?4.5:3.5} fill={eyeGlow} filter="url(#mGlow)"/>
        <circle cx="45.5" cy="47.5" r="1.5" fill="rgba(255,255,255,0.9)"/>
        <circle cx="69.5" cy="47.5" r="1.5" fill="rgba(255,255,255,0.9)"/>
        {anger>0.6&&<>
          <ellipse cx="48" cy="50" rx="8.5" ry="7" fill="none" stroke={eyeGlow} strokeWidth="1" opacity="0.4" style={{animation:"eyePulse 0.8s ease-in-out infinite"}}/>
          <ellipse cx="72" cy="50" rx="8.5" ry="7" fill="none" stroke={eyeGlow} strokeWidth="1" opacity="0.4" style={{animation:"eyePulse 0.8s ease-in-out infinite"}}/>
        </>}

        <path d={`M40 ${41-anger*5} Q48 ${37-anger*6} 56 ${41-anger*4}`}
          stroke={brow} strokeWidth={3+anger*2} fill="none" strokeLinecap="round"/>
        <path d={`M64 ${41-anger*4} Q72 ${37-anger*6} 80 ${41-anger*5}`}
          stroke={brow} strokeWidth={3+anger*2} fill="none" strokeLinecap="round"/>
        {anger>0.4&&<>
          <path d="M54 41 Q60 38 66 41" stroke={brow} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
        </>}

        <ellipse cx="60" cy="56" rx="5" ry="3.5" fill={darkCol}/>
        <circle cx="57.5" cy="55" r="1.5" fill="rgba(0,0,0,0.3)"/>
        <circle cx="62.5" cy="55" r="1.5" fill="rgba(0,0,0,0.3)"/>

        {anger>0.6
          ?<path d={`M44 65 Q60 ${72+anger*4} 76 65`} stroke={darkCol} strokeWidth="3" fill={darkCol} strokeLinecap="round"/>
          :anger>0.3
          ?<path d={`M47 66 Q60 ${63-hp*3} 73 66`} stroke={darkCol} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          :<path d={`M48 68 Q60 ${63} 72 68`} stroke={darkCol} strokeWidth="2" fill="none" strokeLinecap="round"/>
        }

        <ellipse cx="34" cy="52" rx="6" ry="9" fill={bodyCol}/>
        <ellipse cx="34" cy="52" rx="3" ry="5.5" fill={darkCol} opacity="0.4"/>
        <ellipse cx="86" cy="52" rx="6" ry="9" fill={bodyCol}/>
        <ellipse cx="86" cy="52" rx="3" ry="5.5" fill={darkCol} opacity="0.4"/>

        {timerOn&&anger>0.7&&<>
          <text x="12" y="28" fontSize="14" style={{animation:"sparkFloat 1.2s 0.1s ease-out infinite",["--dx"]:"8px",["--dy"]:"-15px"}}>💢</text>
          <text x="95" y="22" fontSize="12" style={{animation:"sparkFloat 1.2s 0.4s ease-out infinite",["--dx"]:"-8px",["--dy"]:"-12px"}}>💢</text>
        </>}

        {anger<0.4&&hp>0&&<>
          <ellipse cx="86" cy="36" rx="2.5" ry="4" fill="rgba(120,200,255,0.75)" transform="rotate(15 86 36)"/>
          <ellipse cx="89" cy="44" rx="2" ry="3.5" fill="rgba(120,200,255,0.55)" transform="rotate(10 89 44)"/>
        </>}
      </svg>

      {!defeated&&(
        <div style={{marginTop:4,padding:"0 10px"}}>
          <div style={{height:7,background:"rgba(90,80,60,0.12)",borderRadius:100,overflow:"hidden",marginBottom:4}}>
            <div style={{height:"100%",width:`${hp*100}%`,
              background:hp>0.6?"linear-gradient(90deg,#FF4400,#FF8800)":hp>0.3?"linear-gradient(90deg,#FF8800,#FFCC00)":"linear-gradient(90deg,#44AA44,#88DD44)",
              borderRadius:100,transition:"width 0.6s ease",
              boxShadow:hp>0.6?"0 0 8px rgba(255,80,0,0.5)":"0 0 6px rgba(80,200,80,0.4)"}}/>
          </div>
          <div style={{fontSize:10,color:"rgba(60,56,40,0.55)",fontWeight:700,letterSpacing:0.5}}>{stage}</div>
        </div>
      )}
      {defeated&&<div style={{fontFamily:"Georgia,serif",fontWeight:800,fontSize:15,color:"#5A9840",marginTop:6,animation:"none"}}>✨ WIPED OUT!</div>}
    </div>
  );
}

const todayStr=()=>new Date().toISOString().slice(0,10);

/* ── Task reschedule options — shown for incomplete tasks in Setup ── */
function TaskReschedule({task,i,data,upd}){
  const [open,setOpen]=useState(false);
  const [mode,setMode]=useState(null);
  const [breakdownItems,setBreakdownItems]=useState([]);
  const [newStep,setNewStep]=useState("");
  const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  if(!open) return(
    <div style={{display:"flex",gap:6,marginTop:4,paddingLeft:34,flexWrap:"wrap"}}>
      <button onClick={()=>{setOpen(true);setMode(null);}}
        style={{background:"rgba(192,57,43,0.06)",color:"#c0392b",border:"1px solid rgba(192,57,43,0.15)",borderRadius:100,padding:"4px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>
        ⚠️ Not done — options
      </button>
    </div>
  );

  return(
    <div style={{marginTop:6,paddingLeft:34}}>
      {!mode&&(
        <div style={{background:"rgba(255,248,240,0.95)",borderRadius:16,padding:"12px 14px",border:"1.5px solid rgba(192,57,43,0.12)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#c0392b",marginBottom:8}}>{`"${task}" wasn't done — what would you like to do?`}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            <button onClick={()=>setMode("calendar")} style={{padding:"7px 12px",background:"rgba(66,133,244,0.10)",color:"#4285f4",border:"1px solid rgba(66,133,244,0.20)",borderRadius:100,fontSize:11,fontWeight:700,cursor:"pointer"}}>📅 Schedule to calendar</button>
            <button onClick={()=>setMode("weekly")} style={{padding:"7px 12px",background:"rgba(90,120,72,0.10)",color:"#3A6020",border:"1px solid rgba(90,120,72,0.20)",borderRadius:100,fontSize:11,fontWeight:700,cursor:"pointer"}}>📆 Move to weekly plan</button>
            <button onClick={()=>setMode("breakdown")} style={{padding:"7px 12px",background:"rgba(192,136,32,0.10)",color:"#C08820",border:"1px solid rgba(192,136,32,0.20)",borderRadius:100,fontSize:11,fontWeight:700,cursor:"pointer"}}>🔧 Break it down</button>
            <button onClick={()=>setOpen(false)} style={{padding:"7px 12px",background:"rgba(90,80,60,0.06)",color:"#8A8070",border:"none",borderRadius:100,fontSize:11,cursor:"pointer"}}>✕ Dismiss</button>
          </div>
        </div>
      )}

      {mode==="calendar"&&(
        <div style={{background:"rgba(240,246,255,0.97)",borderRadius:16,padding:"12px 14px",border:"1.5px solid rgba(66,133,244,0.15)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#4285f4",marginBottom:10}}>📅 Schedule "{task}"</div>
          <button onClick={()=>{
            const now=new Date();now.setDate(now.getDate()+1);
            const d=now.toISOString().slice(0,10).replace(/-/g,"");
            window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task)}&dates=${d}T090000/${d}T100000`,"_blank");
            setOpen(false);
          }} style={{width:"100%",padding:"10px",background:"#4285f4",color:"#fff",border:"none",borderRadius:100,fontWeight:700,fontSize:13,cursor:"pointer",marginBottom:8}}>
            📅 Open Google Calendar
          </button>
          <button onClick={()=>{setMode(null);}} style={{width:"100%",padding:"8px",background:"transparent",color:"#8A8070",border:"none",fontSize:11,cursor:"pointer"}}>← Back</button>
        </div>
      )}

      {mode==="weekly"&&(
        <div style={{background:"rgba(240,248,240,0.97)",borderRadius:16,padding:"12px 14px",border:"1.5px solid rgba(90,120,72,0.20)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#3A6020",marginBottom:8}}>📆 Which day?</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
            {DAYS.map(day=>(
              <button key={day} onClick={()=>{
                try{
                  const wp=JSON.parse(localStorage.getItem('thinko_week_plan')||'[]');
                  const updated=wp.map(d=>d.day===day?{...d,tasks:[...(d.tasks||[]),task]}:{...d});
                  if(!updated.find(d=>d.day===day)) updated.push({day,tasks:[task]});
                  localStorage.setItem('thinko_week_plan',JSON.stringify(updated));
                }catch{}
                setOpen(false);
                alert(`"${task}" added to ${day}'s plan `);
              }} style={{padding:"6px 12px",background:"rgba(90,120,72,0.10)",color:"#3A6020",border:"1px solid rgba(90,120,72,0.20)",borderRadius:100,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                {day.slice(0,3)}
              </button>
            ))}
          </div>
          <button onClick={()=>setMode(null)} style={{fontSize:11,color:"#8A8070",background:"transparent",border:"none",cursor:"pointer"}}>← Back</button>
        </div>
      )}

      {mode==="breakdown"&&(
        <div style={{background:"rgba(255,248,220,0.97)",borderRadius:16,padding:"14px",border:"1.5px solid rgba(192,136,32,0.20)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#C08820",marginBottom:4}}>🔧 Break down "{task}"</div>
          <div style={{fontSize:11,color:"#8A8070",marginBottom:10}}>Split into smaller steps, then add them to today.</div>
          {breakdownItems.map((step,si)=>(
            <div key={si} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{fontSize:11,color:"#C08820",flexShrink:0,width:16}}>•</span>
              <span style={{flex:1,fontSize:13,color:"#1A1A10"}}>{step}</span>
              <button onClick={()=>setBreakdownItems(bi=>bi.filter((_,j)=>j!==si))} style={{background:"none",border:"none",color:"rgba(192,57,43,0.4)",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
          ))}
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            <input value={newStep} onChange={e=>setNewStep(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&newStep.trim()){setBreakdownItems(bi=>[...bi,newStep.trim()]);setNewStep("");}}}
              placeholder="Add a step…"
              style={{flex:1,padding:"8px 12px",borderRadius:100,border:"1.5px solid rgba(192,136,32,0.22)",fontSize:12,outline:"none",background:MULTI,color:"#1A1A10"}}/>
            <button onClick={()=>{if(!newStep.trim())return;setBreakdownItems(bi=>[...bi,newStep.trim()]);setNewStep("");}} style={{background:"#C08820",color:"#fff",border:"none",borderRadius:100,padding:"8px 12px",fontWeight:700,fontSize:12,cursor:"pointer"}}>+</button>
          </div>
          {breakdownItems.length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              <button onClick={()=>{
                const next=[...(data.targetTasks||[]).filter(t=>t?.trim()&&t!==task),...breakdownItems];
                upd({targetTasks:next,dailyTarget:next.length});
                setOpen(false);
              }} style={{padding:"7px 12px",background:"rgba(255,100,0,0.12)",color:"#c0392b",border:"1px solid rgba(255,100,0,0.20)",borderRadius:100,fontSize:11,fontWeight:700,cursor:"pointer"}}>💥 Add to Today</button>
              <button onClick={()=>{
                const DAYS2=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
                const day=DAYS2[new Date().getDay()===0?6:new Date().getDay()-1];
                try{const wp=JSON.parse(localStorage.getItem('thinko_week_plan')||'[]');const updated=DAYS2.map(d=>{const found=wp.find(w=>w.day===d)||{day:d,tasks:[]};return d===day?{...found,tasks:[...(found.tasks||[]),...breakdownItems]}:found;});localStorage.setItem('thinko_week_plan',JSON.stringify(updated));}catch{}
                setOpen(false);alert(`Steps added to this week's plan `);
              }} style={{padding:"7px 12px",background:"rgba(66,133,244,0.10)",color:"#4285f4",border:"1px solid rgba(66,133,244,0.20)",borderRadius:100,fontSize:11,fontWeight:700,cursor:"pointer"}}>📆 Add to Week Plan</button>
            </div>
          )}
          <button onClick={()=>setMode(null)} style={{fontSize:11,color:"#8A8070",background:"transparent",border:"none",cursor:"pointer"}}>← Back</button>
        </div>
      )}
    </div>
  );
}

/* ── This-or-that prioritiser ── */
function ChargeCompare({tasks, onDone}) {
  const active = tasks.filter(t=>t?.trim());
  const pairs = [];
  for(let i=0;i<active.length;i++) for(let j=i+1;j<active.length;j++) pairs.push([active[i],active[j]]);
  const [idx,setIdx] = useState(0);
  const [scores,setScores] = useState({});

  if(pairs.length===0){onDone(active);return null;}

  const choose = w => {
    const ns = {...scores,[w]:(scores[w]||0)+1};
    setScores(ns);
    if(idx+1>=pairs.length) onDone([...active].sort((a,b)=>(ns[b]||0)-(ns[a]||0)));
    else setIdx(i=>i+1);
  };
  const skip = () => {
    if(idx+1>=pairs.length) onDone([...active].sort((a,b)=>(scores[b]||0)-(scores[a]||0)));
    else setIdx(i=>i+1);
  };

  const [a,b] = pairs[idx];
  const pct = Math.round((idx/pairs.length)*100);

  return(
    <div style={{position:"fixed",inset:0,zIndex:500,background:MULTI,display:"flex",flexDirection:"column",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:MULTI,backdropFilter:"blur(16px)",padding:"14px 18px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(90,80,60,0.08)"}}>
        <button onClick={()=>onDone(active)} style={{background:"none",border:"none",cursor:"pointer",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="#1A1A10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:18,color:"#1A1A10",flex:1}}>📊 What matters most?</div>
        <span style={{fontSize:12,color:"#8A8070",fontWeight:600}}>{idx+1} of {pairs.length}</span>
      </div>
      <div style={{height:4,background:"rgba(90,80,60,0.08)"}}>
        <div style={{height:"100%",width:`${pct}%`,background:"#5A7848",transition:"width 0.3s",borderRadius:2}}/>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 20px",gap:20}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#1A1A10",textAlign:"center",lineHeight:1.5}}>
          Which is more important right now?
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:420}}>
          {[a,b].map((task,ti)=>(
            <button key={ti} onClick={()=>choose(task)}
              style={{width:"100%",padding:"20px 22px",borderRadius:22,background:MULTI,border:"1.5px solid rgba(90,120,72,0.20)",cursor:"pointer",display:"flex",alignItems:"center",gap:16,boxShadow:"0 3px 16px rgba(60,70,40,0.08)",transition:"all 0.15s",textAlign:"left"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 6px 24px rgba(60,70,40,0.14)";e.currentTarget.style.borderColor="rgba(90,120,72,0.45)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 3px 16px rgba(60,70,40,0.08)";e.currentTarget.style.borderColor="rgba(90,120,72,0.20)";}}
              onTouchStart={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.borderColor="rgba(90,120,72,0.45)";}}
              onTouchEnd={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.borderColor="rgba(90,120,72,0.20)";}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(90,120,72,0.12)",border:"1.5px solid rgba(90,120,72,0.25)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:"#3A6020"}}>{ti===0?"A":"B"}</div>
              <span style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:"#1A1A10",lineHeight:1.4,flex:1}}>{task}</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={{flexShrink:0,opacity:0.25}}><path d="M1 1l4 4-4 4" stroke="#3A3020" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          ))}
        </div>
        <button onClick={skip} style={{background:"transparent",color:"#8A8070",border:"1px solid rgba(90,80,60,0.18)",borderRadius:100,padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",marginTop:4}}>
          Both equally important — skip
        </button>
      </div>
    </div>
  );
}

/* ── Weekly plan view — assigned tasks by day ── */
function WeekPlan({targetTasks,plan,charged,days,today,DAY_EMOJI,DAYS}){
  const assignments=plan?.assignments||{};
  const todayDi=(new Date().getDay()+6)%7;

  const ADVICE=[
    "Try breaking this into smaller steps — even 5 minutes counts 🌱",
    "What's the very first tiny action you can take? Start there 🐾",
    "Could you do just one part of this? A little progress is still progress 💚",
    "Be kind to yourself — reschedule and try again 🌿",
    "Every missed task is just information, not failure ✨",
  ];

  const daysWithTasks=DAYS.filter(day=>
    targetTasks.some((t,i)=>t?.trim()&&assignments[String(i)]===day)
  );

  if(daysWithTasks.length===0) return(
    <div style={{background:MULTI,borderRadius:24,padding:"16px 18px",marginBottom:14,border:"1px solid rgba(255,255,255,0.9)",boxShadow:"0 2px 14px rgba(0,0,0,0.05)"}}>
      <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:15,marginBottom:6}}>🗓️ Your Plan</div>
      <div style={{fontSize:12,color:"#8A8070"}}>Go to Setup → The Plan to assign tasks to days.</div>
    </div>
  );

  return(
    <div style={{background:MULTI,borderRadius:24,padding:"18px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
      <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:15,marginBottom:12}}>🗓️ Your Plan</div>
      {DAYS.map((day,di)=>{
        const tasksForDay=targetTasks
          .map((t,i)=>({t,i}))
          .filter(({t,i})=>t?.trim()&&assignments[String(i)]===day)
          .map(({t})=>t);
        if(tasksForDay.length===0) return null;

        const isToday=di===todayDi;
        const isPast=di<todayDi;
        const isFuture=di>todayDi;

        const d=new Date();d.setDate(d.getDate()+(di-todayDi));
        const dayStr=d.toISOString().slice(0,10);
        const dayCharged=isToday?charged:(days[dayStr]?.charged||[]);
        const completed=tasksForDay.filter(t=>dayCharged.includes(t));
        const missed=isPast?tasksForDay.filter(t=>!dayCharged.includes(t)):[];
        const allDone=isPast&&tasksForDay.length>0&&missed.length===0;

        return(
          <div key={day} style={{borderRadius:18,marginBottom:10,overflow:"hidden",border:`2px solid ${allDone?"rgba(90,160,80,0.35)":isToday?"rgba(90,120,72,0.30)":"rgba(90,80,60,0.09)"}`,background:allDone?"rgba(90,160,80,0.04)":"rgba(255,255,255,0.60)"}}>
            <div style={{padding:"10px 14px",background:allDone?"rgba(90,160,80,0.10)":isToday?"rgba(90,120,72,0.08)":"rgba(90,80,60,0.03)",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>{DAY_EMOJI[di]}</span>
              <span style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A1A10",flex:1}}>{day}</span>
              {isToday&&<span style={{background:"#5A7848",color:"#fff",fontSize:10,fontWeight:700,borderRadius:100,padding:"2px 10px"}}>Today</span>}
              {isFuture&&<span style={{fontSize:11,color:"#8A8070",fontStyle:"italic"}}>Upcoming</span>}
              {allDone&&<span style={{fontSize:22}}></span>}
            </div>

            {allDone&&(
              <div style={{textAlign:"center",padding:"14px 16px 10px",borderBottom:"1px solid rgba(90,160,80,0.15)"}}>
                <div style={{fontSize:48,marginBottom:4}}>🎉</div>
                <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:"#2A6010",marginBottom:2}}>Incredible — all done!</div>
                <div style={{fontSize:12,color:"#5A7848",lineHeight:1.5}}>Every task on {day} completed. You should be proud 🌟</div>
              </div>
            )}

            <div style={{padding:"8px 14px 12px"}}>
              {tasksForDay.map((task,ti)=>{
                const done=completed.includes(task);
                const isMissed=missed.includes(task);
                return(
                  <div key={ti} style={{marginBottom:isMissed?8:2}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:ti<tasksForDay.length-1?"1px solid rgba(90,80,60,0.07)":"none"}}>
                      <span style={{fontSize:16,flexShrink:0}}>{done?"":isMissed?"⚠️":"◦"}</span>
                      <span style={{flex:1,fontSize:14,fontWeight:600,color:done?"#8A9080":isMissed?"#7A5020":"#1A1A10",textDecoration:done?"line-through":"none"}}>{task}</span>
                    </div>
                    {isMissed&&(
                      <div style={{marginLeft:26,padding:"7px 12px",background:"rgba(255,200,50,0.10)",borderRadius:12,border:"1px solid rgba(200,150,30,0.18)",marginBottom:4}}>
                        <div style={{fontSize:12,color:"#7A5020",lineHeight:1.6}}>💡 {ADVICE[ti%ADVICE.length]}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── The Wipe Out — main screen ── */
function TheCharge({setScreen,onAddGoalFromText}){
  const [data,setData]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('thinkogoals_charge')||'null')||{dailyTarget:3,weeklyAward:"",rewardType:"weekly",rewardFreq:5,reward:{name:"",cost:"",url:"",photo:""},days:{},streak:0};}
    catch{return {dailyTarget:3,weeklyAward:"",rewardType:"weekly",rewardFreq:5,reward:{name:"",cost:"",url:"",photo:""},days:{},streak:0};}
  });
  const [view,setView]=useState("today");
  const [editAward,setEditAward]=useState(false);
  const [rewardDraft,setRewardDraft]=useState({name:"",cost:"",url:"",photo:""});
  const [toast,setToast]=useState("");
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2400);};

  /* Focus / break timers — self-contained for this mini-app */
  const [focusMins,setFocusMins]=useState(20);
  const [focusLeft,setFocusLeft]=useState(null);
  const [focusOn,setFocusOn]=useState(false);
  const [focusAlerted,setFocusAlerted]=useState(false);
  const [breakMins,setBreakMins]=useState(10);
  const [breakLeft,setBreakLeft]=useState(null);
  const [breakOn,setBreakOn]=useState(false);
  const [breakAlerted,setBreakAlerted]=useState(false);
  const fmtTimer=s=>{const sign=s<0?"-":"";const a=Math.abs(s);return `${sign}${Math.floor(a/60)}:${String(a%60).padStart(2,"0")}`;};

  useEffect(()=>{
    if(!focusOn)return;
    const t=setInterval(()=>setFocusLeft(l=>l===null?null:l-1),1000);
    return()=>clearInterval(t);
  },[focusOn]);
  useEffect(()=>{
    if(focusLeft===0&&!focusAlerted){setFocusAlerted(true);showToast("⏰ Focus time's up!");}
  },[focusLeft,focusAlerted]);
  useEffect(()=>{
    if(!breakOn)return;
    const t=setInterval(()=>setBreakLeft(l=>l===null?null:l-1),1000);
    return()=>clearInterval(t);
  },[breakOn]);
  useEffect(()=>{
    if(breakLeft===0&&!breakAlerted){setBreakAlerted(true);showToast("☕ Break's over!");}
  },[breakLeft,breakAlerted]);

  const [plan,setPlan]=useState(()=>{
    try{
      const raw=JSON.parse(localStorage.getItem('thinkogoals_plan')||'null')||{tasks:[],assignments:{}};
      const assignments={};
      Object.entries(raw.assignments||{}).forEach(([k,v])=>{assignments[String(k)]=v;});
      return {...raw,assignments};
    }catch{return {tasks:[],assignments:{}};}
  });
  const savePlan=p=>{setPlan(p);try{localStorage.setItem('thinkogoals_plan',JSON.stringify(p));}catch{}};
  const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const DAY_EMOJI=["🌱","🔥","💪","⚡","🌟","🌿","☀️"];
  const [planTaskInput,setPlanTaskInput]=useState("");

  const [wipeDayData,setWipeDayData]=useState(()=>{try{return JSON.parse(localStorage.getItem('thinkogoals_wipeday')||'null')||{date:"",tasks:[],done:[]};}catch{return {date:"",tasks:[],done:[]};}});
  const saveWipeDay=d=>{setWipeDayData(d);try{localStorage.setItem('thinkogoals_wipeday',JSON.stringify(d));}catch{}};
  const [newWipeTask,setNewWipeTask]=useState("");
  const [wipeExpanded,setWipeExpanded]=useState(false);
  const isWipeDay=wipeDayData.date===new Date().toISOString().slice(0,10)&&wipeDayData.tasks.length>0;
  const wipePct=wipeDayData.tasks.length?Math.round((wipeDayData.done.length/wipeDayData.tasks.length)*100):0;

  const upd=ch=>{const nd={...data,...ch};setData(nd);try{localStorage.setItem('thinkogoals_charge',JSON.stringify(nd));}catch{}};
  const today=todayStr();
  const todayD=data.days[today]||{charged:[],frogs:[]};
  const updToday=ch=>upd({days:{...data.days,[today]:{...todayD,...ch}}});

  const charged=todayD.charged||[];
  const target=data.dailyTarget||3;
  const pct=Math.min(100,Math.round((charged.length/target)*100));
  const hitTarget=charged.length>=target;
  const reward=data.reward||{name:"",cost:"",url:"",photo:""};
  const rewardName=reward.name||data.weeklyAward||"";
  const rewardFreq=data.rewardFreq||5;

  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return d.toISOString().slice(0,10);});
  const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weekPcts=weekDays.map(d=>Math.min(100,Math.round(((data.days[d]?.charged||[]).length/target)*100)));
  const daysHit=weekPcts.filter(p=>p>=100).length;
  const weekTotal=weekDays.reduce((s,d)=>s+(data.days[d]?.charged||[]).length,0);
  const daysUntilReward=Math.max(0,rewardFreq-daysHit);
  const rewardUnlocked=daysHit>=rewardFreq;

  const [dragChargeId,setDragChargeId]=useState(null);
  const [comparing,setComparing]=useState(false);
  const chargeAddRef=useRef(null);
  const setupAddRef=useRef(null);
  const chargeTouchRef=useRef(null);
  const chargeDragOver=(toOrigIdx,allTasks)=>{
    if(dragChargeId===null||dragChargeId===toOrigIdx)return;
    const next=[...allTasks];
    const[m]=next.splice(dragChargeId,1);next.splice(toOrigIdx,0,m);
    upd({targetTasks:next.map(t=>t||"")});
  };
  const chargeTouchStart=(e,origIdx)=>{chargeTouchRef.current=setTimeout(()=>setDragChargeId(origIdx),200);};
  const chargeTouchMove=(e,allTasks)=>{
    if(dragChargeId===null)return;e.preventDefault();
    const el=document.elementFromPoint(e.touches[0].clientX,e.touches[0].clientY);
    const tid=el?.dataset?.chargeidx;if(tid!==undefined&&Number(tid)!==dragChargeId)chargeDragOver(Number(tid),allTasks);
  };
  const chargeTouchEnd=()=>{clearTimeout(chargeTouchRef.current);setDragChargeId(null);};
  const [celebration,setCelebration]=useState(null);
  const [confettiPieces,setConfettiPieces]=useState([]);

  const launchConfetti=(allDone=false)=>{
    const count=allDone?80:45;
    const emojis=allDone
      ?['🎊','🎉','🏆','⭐','🌟','✨','💥','🎆','🎇','👑','🥇','💫']
      :['🎊','🎉','✨','⭐','💥','🌟','⚡'];
    const pieces=Array.from({length:count},(_,i)=>({
      id:i,
      x:Math.random()*100,
      y:-10-Math.random()*20,
      emoji:emojis[Math.floor(Math.random()*emojis.length)],
      size:allDone?(20+Math.random()*24):(14+Math.random()*16),
      rotation:Math.random()*360,
      delay:Math.random()*(allDone?0.8:0.5),
      drift:(Math.random()-0.5)*(allDone?200:140),
      speed:1.5+Math.random()*1.5,
    }));
    setConfettiPieces(pieces);
    try{
      if(allDone){
        const ctx=new(window.AudioContext||window.webkitAudioContext)();
        [[523,0],[659,0.15],[784,0.3],[1047,0.45],[1047,0.6],[1047,0.75]].forEach(([f,t])=>{
          const o=ctx.createOscillator();const g=ctx.createGain();
          o.connect(g);g.connect(ctx.destination);
          o.frequency.value=f;g.gain.setValueAtTime(0.4,ctx.currentTime+t);
          g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.4);
          o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.5);
        });
      } else {
        const ctx=new(window.AudioContext||window.webkitAudioContext)();
        [[523,0],[659,0.12],[784,0.24]].forEach(([f,t])=>{
          const o=ctx.createOscillator();const g=ctx.createGain();
          o.connect(g);g.connect(ctx.destination);
          o.frequency.value=f;g.gain.setValueAtTime(0.3,ctx.currentTime+t);
          g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.3);
          o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.4);
        });
      }
    }catch{}
    setTimeout(()=>setConfettiPieces([]),allDone?5000:3500);
  };

  const chargeIt=name=>{
    if(charged.includes(name))return;
    const nc=[...charged,name];
    updToday({charged:nc});
    if(isWipeDay&&wipeDayData.tasks.includes(name)&&!wipeDayData.done.includes(name)){
      saveWipeDay({...wipeDayData,done:[...wipeDayData.done,name]});
    }
    const hitNow=nc.length>=target;
    const rewardNow=hitNow&&rewardUnlocked;
    setCelebration({name,isTarget:hitNow,isReward:rewardNow});
    launchConfetti(hitNow);
    setTimeout(()=>setCelebration(null),hitNow?5500:3500);
  };

  return(
    <div style={{minHeight:"100vh",background:"transparent",fontFamily:"'Segoe UI',sans-serif",paddingBottom:90}}>

      <div style={{background:MULTI,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",padding:"20px 20px 16px",borderBottom:"1px solid rgba(90,80,60,0.08)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:4}}>
          <div style={{width:36}}/>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#1A1A10",letterSpacing:-0.5,lineHeight:1.1}}>The Wipe Out ✨</div>
            <div style={{fontSize:14,color:"#8A8070",marginTop:3,fontWeight:400}}>Tackle what you've been avoiding</div>
          </div>
          <div style={{width:36}}/>
        </div>

        <div style={{display:"flex",gap:4,background:"rgba(90,80,60,0.07)",borderRadius:100,padding:"4px",marginTop:12}}>
          {[["today","Today"],["week","Week"],["settings","Setup"]].map(([k,l])=>(
            <button key={k} onClick={()=>setView(k)} style={{
              flex:1,padding:"10px 8px",
              background:view===k?"#6A8858":"transparent",
              color:view===k?"#fff":"#6A6050",
              border:"none",borderRadius:100,
              fontWeight:view===k?700:500,
              fontSize:14,cursor:"pointer",
              transition:"all 0.15s",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 16px 0"}}>

        {view==="today"&&<>

          {isWipeDay&&wipePct<100&&(
            <div style={{background:MULTI,borderRadius:20,padding:"14px 18px",marginBottom:12,boxShadow:"0 4px 20px rgba(192,48,16,0.35)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:28}}>💥</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:17,color:"#2A1A08"}}>TODAY IS WIPE OUT DAY!</div>
                  <div style={{fontSize:12,color:"rgba(42,26,8,0.70)"}}>You have {wipeDayData.tasks.length-wipeDayData.done.length} tasks to destroy — you've got this! 🔥</div>
                </div>
              </div>
              <div style={{height:6,background:"rgba(255,255,255,0.20)",borderRadius:100,overflow:"hidden",marginBottom:8}}>
                <div style={{height:"100%",width:`${wipePct}%`,background:"#C03010",borderRadius:100,transition:"width 0.4s"}}/>
              </div>
              <button onClick={()=>{
                const merged=[...new Set([...(data.targetTasks||[]).filter(t=>t?.trim()),...wipeDayData.tasks.filter(t=>!wipeDayData.done.includes(t))])];
                upd({targetTasks:merged,dailyTarget:merged.length});
                showToast("💥 Wipe Out tasks loaded!");
              }} style={{width:"100%",padding:"10px",background:"rgba(255,255,255,0.50)",color:"#2A1A08",border:"1.5px solid rgba(90,80,60,0.25)",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                💥 Load remaining tasks into today
              </button>
            </div>
          )}

          {isWipeDay&&wipePct===100&&(
            <div style={{background:MULTI,borderRadius:20,padding:"16px 18px",marginBottom:12,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:4}}>🏆</div>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:18,color:"#2A1A08",marginBottom:4}}>WIPE OUT DAY COMPLETE!</div>
              <div style={{fontSize:13,color:"rgba(42,26,8,0.70)"}}>You wiped out every single task. LEGENDARY! 🌟</div>
            </div>
          )}

          <div style={{background:MULTI,borderRadius:24,padding:"20px 18px",marginBottom:12,boxShadow:"0 2px 16px rgba(0,0,0,0.06)",border:"1px solid rgba(255,255,255,0.9)",textAlign:"center"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:18,color:"#1A1A10",marginBottom:2}}>
              {hitTarget?"🎉 Monster defeated!":"💥 Wipe it out!"}
            </div>
            <div style={{fontSize:13,color:"#7A7060",marginBottom:14}}>
              {hitTarget
                ?`${charged.length} tasks wiped out — monster destroyed! ✨`
                :charged.length===0
                  ?`${target} tasks to wipe out today — the monster is watching 😤`
                  :`${target-charged.length} more task${target-charged.length!==1?"s":""} to destroy the monster!`}
            </div>
            <WipeOutMonster pct={pct} size={160} timerOn={focusOn}/>
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:14}}>
              <div style={{flex:1,height:8,background:"rgba(90,80,60,0.12)",borderRadius:100,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:hitTarget?"#5A9840":pct>60?"#E07020":"#E04040",borderRadius:100,transition:"width 0.5s ease"}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:"#7A7060",flexShrink:0}}>{charged.length}/{target}</span>
            </div>
          </div>

          {comparing&&(
            <ChargeCompare
              tasks={(data.targetTasks||[]).filter(t=>t?.trim())}
              onDone={ranked=>{
                upd({targetTasks:ranked});
                setComparing(false);
                showToast(" Tasks prioritised!");
              }}
            />
          )}

          <div style={{background:MULTI,borderRadius:22,padding:"16px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:15,marginBottom:10}}>⏱ Focus Timer</div>
            {focusLeft!==null?(
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"monospace",fontSize:52,fontWeight:300,color:focusLeft<0?"#c0392b":focusLeft<60?"#E08020":"#2C3820",lineHeight:1,marginBottom:4}}>
                  {fmtTimer(focusLeft)}
                </div>
                {focusLeft<0&&<div style={{fontSize:12,color:"#c0392b",fontWeight:700,marginBottom:4}}>⏰ Time's up — counting overtime</div>}
                {focusLeft>=0&&(
                  <div style={{height:6,background:"rgba(90,80,60,0.10)",borderRadius:100,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${Math.round((focusLeft/(focusMins*60))*100)}%`,background:focusLeft<60?"#c0392b":"#5A7848",borderRadius:100,transition:"width 1s linear"}}/>
                  </div>
                )}
                <div style={{fontSize:11,color:"#8A8070",marginBottom:10}}>Timer runs across all tasks — keeps counting even after time is up so you know exactly how long your session took</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setFocusOn(f=>!f)} style={{flex:1,padding:"11px",background:focusOn?"rgba(192,57,43,0.10)":"#5A7848",color:focusOn?"#c0392b":"#fff",border:`1.5px solid ${focusOn?"rgba(192,57,43,0.25)":"#5A7848"}`,borderRadius:100,fontWeight:700,fontSize:14,cursor:"pointer"}}>
                    {focusOn?"⏸ Pause":"▶ Resume"}
                  </button>
                  <button onClick={()=>{setFocusLeft(null);setFocusOn(false);setFocusAlerted(false);}} style={{flex:1,padding:"11px",background:"rgba(192,57,43,0.08)",color:"#c0392b",border:"1px solid rgba(192,57,43,0.20)",borderRadius:100,fontWeight:700,fontSize:14,cursor:"pointer"}}>⏹ Stop</button>
                </div>
              </div>
            ):(
              <div>
                <div style={{fontSize:11,color:"#8A8070",marginBottom:8}}>After time is up the timer keeps counting overtime — so you know exactly how long the session took.</div>
                <div style={{display:"flex",gap:6,marginBottom:10}}>
                  {[10,20,30,50].map(m=>(
                    <button key={m} onClick={()=>setFocusMins(m)}
                      style={{flex:1,padding:"9px 0",background:focusMins===m?"#5A7848":"rgba(248,245,236,0.88)",color:focusMins===m?"#fff":"#3A5020",border:`1.5px solid ${focusMins===m?"#5A7848":"rgba(90,120,72,0.22)"}`,borderRadius:12,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                      {m}m
                    </button>
                  ))}
                </div>
                <button onClick={()=>{setFocusLeft(focusMins*60);setFocusOn(true);setFocusAlerted(false);}}
                  style={{width:"100%",padding:"12px",background:"#5A7848",color:"#fff",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:"0 2px 10px rgba(58,80,38,0.25)"}}>
                  ⏱ Start {focusMins}min focus session
                </button>
              </div>
            )}
          </div>

          <div style={{background:MULTI,borderRadius:24,padding:"16px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:16}}>💥 Today's Wipe Out</div>
              <button onClick={()=>setView("settings")} style={{background:"rgba(90,120,72,0.10)",color:"#3A6020",border:"1px solid rgba(90,120,72,0.2)",borderRadius:100,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>✏️ Edit tasks</button>
            </div>
            {(data.targetTasks||[]).map((task,origIdx)=>{
              if(!task?.trim()) return null;
              const done=charged.includes(task);
              return(
                <div key={origIdx}
                  data-chargeidx={origIdx}
                  draggable={!done}
                  onDragStart={e=>{if(done)return;e.dataTransfer.effectAllowed="move";setDragChargeId(origIdx);}}
                  onDragOver={e=>{e.preventDefault();if(!done)chargeDragOver(origIdx,data.targetTasks||[]);}}
                  onDragEnd={()=>setDragChargeId(null)}
                  onTouchStart={e=>{if(!done)chargeTouchStart(e,origIdx);}}
                  onTouchMove={e=>chargeTouchMove(e,data.targetTasks||[])}
                  onTouchEnd={chargeTouchEnd}
                  style={{background:done?"rgba(90,160,80,0.08)":"rgba(255,255,255,0.85)",borderRadius:16,padding:"11px 13px",marginBottom:8,border:`1.5px solid ${done?"rgba(90,160,80,0.25)":"rgba(90,120,72,0.12)"}`,cursor:done?"default":"grab",touchAction:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {!done&&<div style={{cursor:"grab",color:"rgba(90,120,72,0.30)",fontSize:15,flexShrink:0}}>⠿</div>}
                    <div style={{flex:1,fontSize:15,fontWeight:done?400:700,color:done?"#8A9080":"#1A1A10",textDecoration:done?"line-through":"none"}}>{task}</div>
                    {!done
                      ?<button onClick={()=>chargeIt(task)} style={{background:"#5A7848",color:"#fff",border:"none",borderRadius:100,padding:"7px 16px",fontSize:13,fontWeight:800,cursor:"pointer",flexShrink:0}}>💥 Wipe!</button>
                      :<button onClick={()=>updToday({charged:charged.filter(c=>c!==task)})} style={{background:"rgba(90,80,60,0.08)",color:"#8A8070",border:"1px solid rgba(90,80,60,0.15)",borderRadius:100,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>↩ Undo</button>
                    }
                    <button onClick={()=>{const next=[...(data.targetTasks||[])];next[origIdx]="";if(done)updToday({charged:charged.filter(c=>c!==task)});upd({targetTasks:next});showToast("🗑 Deleted");}} style={{background:"rgba(192,57,43,0.08)",color:"#c0392b",border:"none",borderRadius:100,padding:"6px 10px",fontSize:12,cursor:"pointer",flexShrink:0}}>🗑</button>
                  </div>
                </div>
              );
            })}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <input ref={chargeAddRef}
                placeholder="Add a task and press +"
                style={{flex:1,padding:"10px 14px",borderRadius:100,border:"1.5px solid rgba(90,120,72,0.22)",fontSize:14,color:"#1A1A10",outline:"none",background:MULTI}}
                onKeyDown={e=>{if(e.key==="Enter"){const v=e.target.value.trim();if(!v)return;const next=[...(data.targetTasks||[]),v];upd({targetTasks:next,dailyTarget:Math.max(target,next.filter(t=>t?.trim()).length)});e.target.value="";}}}/>
              <button onClick={()=>{const inp=chargeAddRef.current;if(!inp||!inp.value.trim())return;const next=[...(data.targetTasks||[]),inp.value.trim()];upd({targetTasks:next,dailyTarget:Math.max(target,next.filter(t=>t?.trim()).length)});inp.value="";inp.focus();}} style={{background:"#5A7848",color:"#fff",border:"none",borderRadius:"50%",width:40,height:40,fontSize:22,cursor:"pointer",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>+</button>
            </div>
            {(data.targetTasks||[]).filter(t=>t?.trim()).length>1&&(
              <div style={{marginTop:12,padding:"12px 14px",background:"rgba(90,120,72,0.06)",borderRadius:16,border:"1px solid rgba(90,120,72,0.14)"}}>
                <div style={{fontSize:13,fontWeight:700,color:"#3A5020",marginBottom:4}}>📊 Prioritise your tasks</div>
                <div style={{fontSize:12,color:"#7A7060",marginBottom:10,lineHeight:1.5}}>Not sure which to tackle first? Let us help — we'll show you two tasks at a time and ask which matters more.</div>
                <button onClick={()=>setComparing(true)} style={{width:"100%",padding:"11px",background:"#5A7848",color:"#fff",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:"0 2px 10px rgba(58,80,38,0.22)"}}>
                  📊 What matters most? Rank my tasks
                </button>
              </div>
            )}
          </div>

          {celebration&&(
            <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",
              background:celebration.isTarget
                ?"radial-gradient(ellipse at center, rgba(20,60,10,0.95) 0%, rgba(5,20,5,0.98) 100%)"
                :"rgba(10,10,10,0.82)",
              backdropFilter:"blur(6px)"}}
              onClick={()=>setCelebration(null)}>

              {confettiPieces.map(p=>(
                <div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:"-5%",fontSize:p.size,
                  animation:`confettiFall ${p.speed}s ${p.delay}s ease-in forwards`,
                  transform:`rotate(${p.rotation}deg)`,pointerEvents:"none",zIndex:1}}>
                  {p.emoji}
                </div>
              ))}

              {celebration.isTarget?(
                <div style={{textAlign:"center",zIndex:2,padding:"0 24px",width:"100%",maxWidth:400,margin:"0 auto"}}>
                  <div style={{fontSize:100,lineHeight:1,marginBottom:16,
                    animation:"celebBounce 0.5s ease-in-out infinite alternate",
                    filter:"drop-shadow(0 0 30px rgba(255,215,0,0.8)) drop-shadow(0 0 60px rgba(255,160,0,0.5))"}}>
                    🏆
                  </div>
                  <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:34,color:"#FFD700",
                    lineHeight:1.1,marginBottom:12,letterSpacing:-0.5,
                    textShadow:"0 0 30px rgba(255,215,0,0.6), 0 2px 0 rgba(0,0,0,0.4)",
                    animation:"celebPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
                    {["YOU ARE\nABSOLUTELY\nUNSTOPPABLE!","LEGENDARY!\nFULL POWER\nACHIEVED!","CHAMPION!\nEVERY TASK\nDESTROYED!","MONSTER\nWIPED OUT\nCOMPLETELY!"][Math.floor(Date.now()/1000)%4].split('\n').map((line,i)=>(
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                  <div style={{fontSize:16,color:"rgba(255,255,255,0.90)",lineHeight:1.7,marginBottom:20,
                    fontFamily:"'Segoe UI',sans-serif",fontWeight:500}}>
                    You can <strong style={{color:"#FFD700"}}>achieve anything</strong> you put your mind to ✨<br/>
                    You did every single thing you set out to do today.<br/>
                    <strong style={{color:"#90FF90"}}>That's who you are.</strong>
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:24}}>
                    {Array.from({length:Math.min(target,10)}).map((_,i)=>(
                      <div key={i} style={{width:18,height:18,borderRadius:"50%",
                        background:"#FFD700",
                        boxShadow:"0 0 12px rgba(255,215,0,0.8), 0 0 24px rgba(255,215,0,0.4)",
                        animation:`celebPulse ${0.2+i*0.08}s ease-in-out infinite alternate`}}/>
                    ))}
                  </div>
                  {rewardName&&(
                    <div style={{background:"linear-gradient(135deg,rgba(255,215,0,0.20),rgba(255,160,0,0.15))",
                      border:"2.5px solid rgba(255,215,0,0.50)",borderRadius:24,
                      padding:"20px 22px",marginBottom:20,
                      boxShadow:"0 0 30px rgba(255,215,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10)"}}>
                      <div style={{fontSize:44,marginBottom:8}}>🎁</div>
                      <div style={{fontFamily:"Georgia,serif",fontWeight:800,fontSize:20,color:"#FFD700",marginBottom:6}}>
                        YOUR REWARD IS WAITING!
                      </div>
                      <div style={{fontSize:15,color:"rgba(255,255,255,0.90)",lineHeight:1.6}}>
                        You earned: <strong style={{color:"#FFD700",fontSize:17}}>"{rewardName}"</strong>
                      </div>
                      <div style={{fontSize:13,color:"rgba(255,215,0,0.70)",marginTop:6,fontStyle:"italic"}}>
                        Go enjoy every second of it — you deserve it 🌿
                      </div>
                    </div>
                  )}
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:4}}>Tap anywhere to continue</div>
                </div>
              ):(
                <div style={{background:"rgba(255,253,240,0.97)",borderRadius:28,padding:"32px 28px",
                  textAlign:"center",boxShadow:"0 20px 80px rgba(0,0,0,0.5)",
                  maxWidth:300,margin:"0 24px",zIndex:2,
                  border:"2.5px solid rgba(90,160,80,0.35)",
                  animation:"celebPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
                  <div style={{fontSize:70,marginBottom:8,
                    animation:"celebBounce 0.5s ease-in-out infinite alternate",lineHeight:1}}>
                    🎉
                  </div>
                  <div style={{fontFamily:"Georgia,serif",fontWeight:800,fontSize:24,color:"#1A1A10",marginBottom:8,lineHeight:1.2}}>
                    {[["Well done, you got this! 💪","Amazing achievement — every step counts! 🌟","Another task achieved, you're doing amazing! 🎉","Yes! Keep going, you're unstoppable! ✨","That's what we're talking about! 🏆","Brilliant — one step closer! 🌿","Look at you go! Keep it up! 💫"][Math.floor(Math.random()*7)],"YES! ONE DOWN! ⚡","BOOM! WIPED OUT! 💥","KEEP GOING! 🔥"][charged.length%4]}
                  </div>
                  <div style={{fontSize:14,color:"#5A7060",lineHeight:1.7,marginBottom:12}}>
                    {celebration.isReward
                      ?<><strong style={{color:"#C0A020",fontSize:16}}>🎁 Reward unlocked!</strong><br/>"{rewardName}"<br/>Go enjoy it — you earned it! 🌿</>
                      :[
                        "Well done, you got this! 💪",
                        "Amazing achievement — every step counts! 🌟",
                        "Another task achieved, you're doing amazing! 🎉",
                        "Yes! Keep going, you're unstoppable! ✨",
                        "That's what we're talking about! 🏆",
                        "Brilliant — one step closer! 🌿",
                        "Look at you go! 💫",
                      ][Math.floor(Math.random()*7)]
                    }
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:10}}>
                    {Array.from({length:target}).map((_,i)=>(
                      <div key={i} style={{width:10,height:10,borderRadius:"50%",
                        background:i<charged.length?"#5A7848":"rgba(90,80,60,0.15)",
                        transition:"background 0.3s",
                        boxShadow:i<charged.length?"0 0 6px rgba(90,120,72,0.5)":"none"}}/>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:"#C0B090"}}>Tap anywhere to continue</div>
                </div>
              )}
            </div>
          )}
          <style>{`
            @keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) translateX(var(--drift,0px)) rotate(720deg);opacity:0}}
            @keyframes celebPop{0%{transform:scale(0.2) rotate(-5deg);opacity:0}100%{transform:scale(1) rotate(0deg);opacity:1}}
            @keyframes celebBounce{0%{transform:scale(1) rotate(-4deg)}100%{transform:scale(1.18) rotate(4deg)}}
            @keyframes celebPulse{0%{transform:scale(0.7);opacity:0.5}100%{transform:scale(1.3);opacity:1}}
          `}</style>

          {!rewardName?(
            <div style={{background:MULTI,borderRadius:22,padding:"16px 18px",marginBottom:16,border:"1.5px dashed rgba(90,120,72,0.25)",boxShadow:"0 2px 12px rgba(60,70,40,0.05)"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontSize:32}}>🎁</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:"#1A1A10",marginBottom:3}}>Set up your reward</div>
                  <div style={{fontSize:12,color:"#8A8070",lineHeight:1.5}}>Give yourself something to work toward — a treat, an experience, anything that motivates you.</div>
                </div>
              </div>
              <button onClick={()=>setView("settings")} style={{width:"100%",marginTop:12,padding:"11px",background:"#5A7848",color:"#fff",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:"0 2px 10px rgba(58,80,38,0.25)"}}>
                🎁 Set up your reward
              </button>
            </div>
          ):(()=>{
            const unlockDate=new Date();
            unlockDate.setDate(unlockDate.getDate()+daysUntilReward);
            const dateStr=unlockDate.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
            return(
              <div style={{background:rewardUnlocked?"linear-gradient(135deg,rgba(90,160,80,0.12),rgba(120,180,100,0.08))":"rgba(248,245,236,0.90)",borderRadius:24,padding:"18px 18px",marginBottom:16,boxShadow:"0 2px 16px rgba(0,0,0,0.06)",border:`1px solid ${rewardUnlocked?"rgba(90,160,80,0.30)":daysUntilReward===1?"rgba(200,160,60,0.30)":"rgba(255,255,255,0.9)"}`}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                  {reward.photo
                    ?<img src={reward.photo} alt="" style={{width:56,height:56,borderRadius:14,objectFit:"cover",flexShrink:0}}/>
                    :<span style={{fontSize:32,flexShrink:0}}>🎁</span>}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:2}}>
                      <div style={{flex:1,fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:"#1A1A10"}}>
                        {rewardName||<span>No reward set — <button onClick={()=>setView("settings")} style={{background:"none",border:"none",color:"#5A7848",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"Georgia,serif",textDecoration:"underline",padding:0}}>tap Setup</button></span>}
                      </div>
                      {rewardName&&<button onClick={()=>{if(window.confirm("Delete this reward?")){upd({weeklyAward:"",reward:{name:"",cost:"",url:"",photo:""},rewardDate:""});showToast("🗑 Reward deleted");}}} style={{background:"rgba(192,57,43,0.08)",color:"#c0392b",border:"1px solid rgba(192,57,43,0.12)",borderRadius:100,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>🗑 Delete</button>}
                    </div>
                    {reward.cost&&<div style={{fontSize:12,color:"#8A8070",marginBottom:2}}>💰 {reward.cost}</div>}
                    {reward.url&&<a href={reward.url} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#5A7848",display:"block",marginBottom:2}}>🔗 View</a>}
                    {rewardName&&(
                      <div style={{marginTop:6,padding:"8px 12px",background:rewardUnlocked?"rgba(90,160,80,0.15)":daysUntilReward===1?"rgba(220,180,60,0.15)":"rgba(90,120,72,0.08)",borderRadius:12,border:`1px solid ${rewardUnlocked?"rgba(90,160,80,0.25)":daysUntilReward===1?"rgba(200,160,40,0.25)":"rgba(90,120,72,0.15)"}`}}>
                        {rewardUnlocked
                          ?<><div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#2A7020",fontSize:14}}>🎉 You can reward yourself now!</div><div style={{fontSize:12,color:"#3A8030",marginTop:2}}>You've earned it — enjoy every bit of it 🌿</div></>
                          :daysUntilReward===1
                          ?<><div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#7A5020",fontSize:14}}>🌟 One more day!</div><div style={{fontSize:12,color:"#8A6030",marginTop:2}}>Hit your {target} tasks today and unlock "{rewardName}" tomorrow — {dateStr}</div></>
                          :<><div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#3A5020",fontSize:13}}>📅 Unlock on {dateStr}</div><div style={{fontSize:12,color:"#7A7060",marginTop:2}}>{daysUntilReward} more day{daysUntilReward!==1?"s":""} · hit {target} task{target!==1?"s":""}/day to unlock</div></>
                        }
                      </div>
                    )}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <div style={{display:"flex",gap:4,flex:1}}>
                    {Array.from({length:rewardFreq}).map((_,i)=>(
                      <div key={i} style={{flex:1,height:6,borderRadius:100,background:i<daysHit?"#6A8858":"rgba(90,80,60,0.15)",transition:"background 0.3s"}}/>
                    ))}
                  </div>
                  <span style={{fontSize:11,color:"#8A8070",flexShrink:0,marginLeft:4}}>{daysHit}/{rewardFreq}</span>
                </div>
              </div>
            );
          })()}

          <div style={{background:MULTI,borderRadius:22,padding:"16px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:16,marginBottom:10}}>☕ Break Timer</div>
            {breakLeft!==null?(
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"monospace",fontSize:52,fontWeight:300,color:breakLeft<0?"#c0392b":breakLeft<60?"#E08020":"#2C3820",lineHeight:1,marginBottom:4}}>{fmtTimer(breakLeft)}</div>
                {breakLeft<0&&<div style={{fontSize:12,color:"#c0392b",fontWeight:700,marginBottom:4}}>☕ Break over — counting overtime</div>}
                {breakLeft>=0&&(
                  <div style={{height:6,background:"rgba(90,80,60,0.10)",borderRadius:100,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${Math.round((breakLeft/(breakMins*60))*100)}%`,background:breakLeft<60?"#c0392b":"#5A7848",borderRadius:100,transition:"width 1s linear"}}/>
                  </div>
                )}
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  <button onClick={()=>setBreakOn(b=>!b)} style={{flex:1,padding:"11px",background:breakOn?"rgba(192,57,43,0.10)":"#5A7848",color:breakOn?"#c0392b":"#fff",border:`1.5px solid ${breakOn?"rgba(192,57,43,0.25)":"#5A7848"}`,borderRadius:100,fontWeight:700,fontSize:14,cursor:"pointer"}}>
                    {breakOn?"⏸ Pause":"▶ Resume"}
                  </button>
                  <button onClick={()=>{setBreakLeft(null);setBreakOn(false);setBreakAlerted(false);}} style={{flex:1,padding:"11px",background:"rgba(192,57,43,0.08)",color:"#c0392b",border:"1px solid rgba(192,57,43,0.20)",borderRadius:100,fontWeight:700,fontSize:14,cursor:"pointer"}}>⏹ Stop</button>
                </div>
              </div>
            ):(
              <div>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  {[5,10,15,20,30].map(m=>(
                    <button key={m} onClick={()=>setBreakMins(m)}
                      style={{flex:1,padding:"9px 0",background:breakMins===m?"#5A7848":"rgba(248,245,236,0.88)",color:breakMins===m?"#fff":"#3A5020",border:`1.5px solid ${breakMins===m?"#5A7848":"rgba(90,120,72,0.22)"}`,borderRadius:12,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                      {m}m
                    </button>
                  ))}
                </div>
                <button onClick={()=>{setBreakLeft(breakMins*60);setBreakOn(true);setBreakAlerted(false);}}
                  style={{width:"100%",padding:"12px",background:"#5A7848",color:"#fff",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:"0 2px 10px rgba(58,80,38,0.25)"}}>
                  ☕ Start {breakMins}min break
                </button>
              </div>
            )}
          </div>

          {charged.length>0&&(
            <div style={{background:"rgba(90,160,80,0.08)",borderRadius:22,padding:"16px 18px",marginBottom:14,border:"1px solid rgba(90,160,80,0.2)"}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#3A6020",fontSize:15,marginBottom:10}}> Charged today ({charged.length})</div>
              {charged.map((n,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:i<charged.length-1?"1px solid rgba(90,120,72,0.12)":"none"}}>
                  <span style={{fontSize:14}}>⚡</span>
                  <span style={{flex:1,fontSize:13,fontWeight:600,color:"#3A5020"}}>{n}</span>
                  <button onClick={()=>{updToday({charged:charged.filter((_,j)=>j!==i)});}} style={{background:"rgba(192,57,43,0.08)",color:"#c0392b",border:"1px solid rgba(192,57,43,0.12)",borderRadius:100,padding:"3px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </>}

        {view==="week"&&<>

          <div style={{background:MULTI,borderRadius:24,padding:"22px 20px",marginBottom:14,boxShadow:"0 2px 16px rgba(0,0,0,0.06)",border:"1px solid rgba(255,255,255,0.9)",textAlign:"center"}}>
            <OrbOfLight pct={weekPcts.reduce((a,b)=>a+b,0)/7} size={140}/>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:20,marginTop:12}}>Weekly Wipe Out</div>
            <div style={{color:"#8A8070",fontSize:13,marginTop:4}}>{daysHit}/7 days fully wiped out · {weekTotal} total tasks</div>
            {daysHit>=5&&data.weeklyAward&&(
              <div style={{marginTop:14,background:"rgba(90,120,72,0.10)",borderRadius:16,padding:"12px 18px"}}>
                <div style={{fontFamily:"Georgia,serif",color:"#3A6020",fontWeight:700,fontSize:15}}>🎁 Weekly reward unlocked!</div>
                <div style={{color:"#5A7040",fontSize:14,marginTop:4}}>{data.weeklyAward}</div>
              </div>
            )}
          </div>

          <WeekPlan
            targetTasks={data.targetTasks||[]}
            plan={plan}
            charged={charged}
            days={data.days||{}}
            today={today}
            DAY_EMOJI={DAY_EMOJI}
            DAYS={DAYS}
          />

          {(data.targetTasks||[]).some((_,i)=>plan.assignments?.[String(i)])&&(
            <div style={{background:MULTI,borderRadius:22,padding:"16px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:15,marginBottom:4}}>📅 Add to Calendar</div>
              <div style={{fontSize:12,color:"#8A8070",marginBottom:12,lineHeight:1.5}}>Add your planned tasks to Google Calendar — one event per day with all tasks listed.</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {DAYS.map((day,di)=>{
                  const tasksForDay=(data.targetTasks||[]).filter((t,i)=>t?.trim()&&plan.assignments?.[String(i)]===day);
                  if(!tasksForDay.length) return null;
                  return(
                    <button key={day} onClick={()=>{
                      const now=new Date();
                      const diff=((di-((now.getDay()+6)%7))+7)%7||7;
                      const d=new Date(now);d.setDate(now.getDate()+diff);
                      const pad=n=>String(n).padStart(2,"0");
                      const dt=`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
                      const title=`${DAY_EMOJI[di]} ${day} — My Tasks`;
                      const details=tasksForDay.map((t,i)=>`• ${t}`).join('\n');
                      const url=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dt}T090000/${dt}T170000&details=${encodeURIComponent(details)}`;
                      window.open(url,"_blank");
                    }} style={{width:"100%",padding:"11px 14px",background:"rgba(66,133,244,0.08)",color:"#4285f4",border:"1.5px solid rgba(66,133,244,0.22)",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
                      <span style={{fontSize:16}}>{DAY_EMOJI[di]}</span>
                      <span style={{flex:1}}>{day}</span>
                      <span style={{fontSize:12,opacity:0.7}}>{tasksForDay.length} task{tasksForDay.length!==1?"s":""}</span>
                      <span style={{fontSize:12}}>→ Calendar</span>
                    </button>
                  );
                })}
                <button onClick={()=>{
                  const lines=DAYS.flatMap((day,di)=>{
                    const t=(data.targetTasks||[]).filter((t,i)=>t?.trim()&&plan.assignments?.[String(i)]===day);
                    return t.length?[`${DAY_EMOJI[di]} ${day}:`,...t.map(t=>`  • ${t}`),""]:[];
                  });
                  navigator.clipboard?.writeText(lines.join('\n'));
                  showToast("📋 Plan copied to clipboard!");
                }} style={{width:"100%",padding:"11px",background:"rgba(90,120,72,0.08)",color:"#3A6020",border:"1px solid rgba(90,120,72,0.20)",borderRadius:100,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  📋 Copy full plan to clipboard
                </button>
              </div>
            </div>
          )}

          <div style={{background:MULTI,borderRadius:24,padding:"18px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:15,marginBottom:14}}>This week</div>
            <div style={{display:"flex",gap:6,alignItems:"flex-end",height:80}}>
              {weekDays.map((d,i)=>{
                const p=weekPcts[i];const isToday=d===today;
                return(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <div style={{width:"100%",height:60,background:"rgba(90,80,60,0.08)",borderRadius:8,display:"flex",alignItems:"flex-end",overflow:"hidden"}}>
                      <div style={{width:"100%",height:`${Math.max(4,p)}%`,background:p>=100?"#5A7848":p>0?"#8AAA78":"rgba(90,80,60,0.1)",borderRadius:"6px 6px 0 0",transition:"height 0.4s"}}/>
                    </div>
                    <div style={{fontSize:9,fontWeight:isToday?800:500,color:isToday?"#3A6020":"#9A9080"}}>{dayNames[new Date(d).getDay()]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{background:MULTI,borderRadius:24,padding:"18px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontSize:40}}>🔥</div>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:20}}>{data.streak||0} day streak</div>
                <div style={{color:"#8A8070",fontSize:13}}>Days in a row hitting your target</div>
              </div>
            </div>
          </div>

        </>}

        {view==="settings"&&<>
          <div style={{background:MULTI,borderRadius:24,padding:"20px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:16,marginBottom:2}}>💥 Today's Wipe Out</div>
            <div style={{color:"#8A8070",fontSize:12,marginBottom:14,lineHeight:1.5}}>Add your tasks here — they appear straight on your Today page. Edit or delete anytime.</div>
            {(data.targetTasks||[]).map((task,i)=>{
              if(!task?.trim()) return null;
              const isIncomplete=!charged.includes(task);
              return(
                <div key={i} style={{marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:isIncomplete?"rgba(192,57,43,0.08)":"rgba(90,120,72,0.12)",border:`1.5px solid ${isIncomplete?"rgba(192,57,43,0.22)":"rgba(90,120,72,0.22)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:isIncomplete?"#c0392b":"#3A6020",flexShrink:0}}>{isIncomplete?"!":i+1}</div>
                    <input
                      value={task}
                      onChange={e=>{const next=[...(data.targetTasks||[])];next[i]=e.target.value;upd({targetTasks:next});}}
                      style={{flex:1,padding:"10px 14px",borderRadius:100,border:`1.5px solid ${isIncomplete?"rgba(192,57,43,0.22)":"rgba(90,120,72,0.18)"}`,fontSize:14,color:"#1A1A10",outline:"none",background:MULTI}}/>
                    <button onClick={()=>{const next=(data.targetTasks||[]).filter((_,j)=>j!==i);upd({targetTasks:next,dailyTarget:next.filter(t=>t?.trim()).length||1});}} style={{background:"rgba(192,57,43,0.08)",color:"#c0392b",border:"none",borderRadius:"50%",width:30,height:30,fontSize:14,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>🗑</button>
                  </div>
                  {isIncomplete&&(
                    <TaskReschedule task={task} i={i} data={data} upd={upd}/>
                  )}
                </div>
              );
            })}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <input ref={setupAddRef}
                placeholder="Type a task and tap Add…"
                style={{flex:1,padding:"10px 14px",borderRadius:100,border:"1.5px solid rgba(90,120,72,0.22)",fontSize:14,color:"#1A1A10",outline:"none",background:MULTI}}
                onKeyDown={e=>{
                  if(e.key==="Enter"&&e.target.value.trim()){
                    const next=[...(data.targetTasks||[]).filter(t=>t?.trim()),e.target.value.trim()];
                    upd({targetTasks:next,dailyTarget:next.length});
                    e.target.value="";
                  }
                }}/>
              <button onClick={()=>{
                const inp=setupAddRef.current;
                if(!inp||!inp.value.trim())return;
                const next=[...(data.targetTasks||[]).filter(t=>t?.trim()),inp.value.trim()];
                upd({targetTasks:next,dailyTarget:next.length});
                inp.value="";inp.focus();
              }} style={{background:"#5A7848",color:"#fff",border:"none",borderRadius:100,padding:"10px 18px",fontSize:14,fontWeight:700,cursor:"pointer",flexShrink:0}}>+ Add</button>
            </div>
            {(data.targetTasks||[]).filter(t=>t?.trim()).length>0&&(
              <div style={{marginTop:10,fontSize:11,color:"#5A7040",fontWeight:600,textAlign:"center"}}> {(data.targetTasks||[]).filter(t=>t?.trim()).length} task{(data.targetTasks||[]).filter(t=>t?.trim()).length!==1?"s":""} ready on your Today page</div>
            )}
          </div>

          <div style={{background:MULTI,borderRadius:24,padding:"20px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:16,marginBottom:4}}>🎁 Your reward</div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {["daily","weekly"].map(t=>(
                <button key={t} onClick={()=>upd({rewardType:t})} style={{flex:1,padding:"10px",background:(data.rewardType||"weekly")===t?"#6A8858":"rgba(248,245,236,0.95)",color:(data.rewardType||"weekly")===t?"#fff":"#3A3020",border:`1.5px solid ${(data.rewardType||"weekly")===t?"#6A8858":"rgba(90,80,60,0.15)"}`,borderRadius:14,fontWeight:700,fontSize:14,cursor:"pointer"}}>
                  {t==="daily"?"Daily":"Weekly"}
                </button>
              ))}
            </div>
            <div style={{fontSize:12,color:"#8A8070",marginBottom:8}}>Unlock after hitting target for:</div>
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              {((data.rewardType||"weekly")==="daily"?[1]:[2,3,4,5,6,7]).map(n=>(
                <button key={n} onClick={()=>upd({rewardFreq:n})} style={{flex:1,minWidth:36,padding:"9px 6px",background:(data.rewardFreq||5)===n?"#6A8858":"rgba(248,245,236,0.95)",color:(data.rewardFreq||5)===n?"#fff":"#3A3020",border:`1.5px solid ${(data.rewardFreq||5)===n?"#6A8858":"rgba(90,80,60,0.15)"}`,borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer"}}>{n}d</button>
              ))}
            </div>
            {(data.reward?.name||data.weeklyAward)&&(()=>{
              const unlockDate=new Date();
              unlockDate.setDate(unlockDate.getDate()+(daysUntilReward));
              const dateStr=unlockDate.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
              return(
                <div style={{background:rewardUnlocked?"rgba(90,160,80,0.12)":daysUntilReward===1?"rgba(220,180,80,0.12)":"rgba(90,120,72,0.07)",borderRadius:16,padding:"12px 16px",marginBottom:14,border:`1px solid ${rewardUnlocked?"rgba(90,160,80,0.25)":daysUntilReward===1?"rgba(200,160,60,0.25)":"rgba(90,120,72,0.15)"}`}}>
                  {rewardUnlocked
                    ?<div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#2A7020",fontSize:15}}>🎉 You've unlocked your reward!</div>
                    :daysUntilReward===1
                    ?<><div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#7A5020",fontSize:15}}>🌟 One more day!</div><div style={{fontSize:12,color:"#8A7060",marginTop:3}}>Hit today's {target} tasks and unlock your reward tomorrow — {dateStr}</div></>
                    :<><div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#3A5020",fontSize:14}}>📅 Reward unlock date</div><div style={{fontSize:13,color:"#5A7040",marginTop:3,fontWeight:600}}>{dateStr}</div><div style={{fontSize:11,color:"#8A8070",marginTop:2}}>Hit {target} tasks/day for {daysUntilReward} more day{daysUntilReward!==1?"s":""}</div></>
                  }
                </div>
              );
            })()}
            {editAward?(
              <>
                <input value={rewardDraft.name||""} onChange={e=>setRewardDraft(d=>({...d,name:e.target.value}))}
                  placeholder="e.g. New book, massage, takeaway…"
                  style={{width:"100%",boxSizing:"border-box",padding:"12px 16px",borderRadius:100,border:"1.5px solid rgba(90,120,72,0.25)",fontSize:14,color:"#1A1A10",outline:"none",marginBottom:8,background:MULTI}}/>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input value={rewardDraft.cost||""} onChange={e=>setRewardDraft(d=>({...d,cost:e.target.value}))}
                    placeholder="💰 Cost (optional)"
                    style={{flex:1,padding:"11px 14px",borderRadius:100,border:"1.5px solid rgba(90,120,72,0.15)",fontSize:13,color:"#1A1A10",outline:"none",background:MULTI}}/>
                  <input value={rewardDraft.url||""} onChange={e=>setRewardDraft(d=>({...d,url:e.target.value}))}
                    placeholder="🔗 Link (optional)"
                    style={{flex:1,padding:"11px 14px",borderRadius:100,border:"1.5px solid rgba(90,120,72,0.15)",fontSize:13,color:"#1A1A10",outline:"none",background:MULTI}}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,padding:"10px 14px",background:"rgba(90,120,72,0.05)",borderRadius:16,border:"1px solid rgba(90,120,72,0.12)"}}>
                  <span style={{fontSize:16}}>📅</span>
                  <span style={{fontSize:13,color:"#5A7848",fontWeight:600,flexShrink:0}}>Want it by:</span>
                  <input type="date" value={rewardDraft.date||""} onChange={e=>setRewardDraft(d=>({...d,date:e.target.value}))}
                    style={{flex:1,border:"none",outline:"none",fontSize:13,color:"#1A1A10",background:"transparent",cursor:"pointer"}}/>
                  {rewardDraft.date&&<button onClick={()=>setRewardDraft(d=>({...d,date:""}))} style={{background:"none",border:"none",color:"#8A8070",cursor:"pointer",fontSize:14}}>✕</button>}
                </div>
                <label style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(90,120,72,0.06)",borderRadius:16,border:"1.5px dashed rgba(90,120,72,0.22)",cursor:"pointer",marginBottom:8}}>
                  {rewardDraft.photo?<img src={rewardDraft.photo} alt="" style={{width:44,height:44,borderRadius:10,objectFit:"cover",flexShrink:0}}/>:<span style={{fontSize:24}}>📷</span>}
                  <span style={{fontSize:13,color:"#5A7848",fontWeight:600}}>{rewardDraft.photo?"Change photo":"Add a photo of your reward"}</span>
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setRewardDraft(d=>({...d,photo:ev.target.result}));r.readAsDataURL(f);}}/>
                </label>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setEditAward(false)} style={{flex:1,background:"rgba(90,80,60,0.08)",color:"#8A8070",border:"none",borderRadius:100,padding:"11px",fontWeight:600,cursor:"pointer"}}>Cancel</button>
                  <button onClick={()=>{upd({weeklyAward:rewardDraft.name,reward:rewardDraft,rewardDate:rewardDraft.date||""});setEditAward(false);showToast("🎁 Reward saved!");}} style={{flex:2,background:"#6A8858",color:"#fff",border:"none",borderRadius:100,padding:"11px",fontWeight:700,cursor:"pointer",boxShadow:"0 3px 12px rgba(90,120,72,0.28)"}}>Save Reward</button>
                </div>
              </>
            ):(
              <button onClick={()=>{setRewardDraft({...(data.reward||{name:"",cost:"",url:"",photo:""}),date:data.rewardDate||""});setEditAward(true);}} style={{width:"100%",padding:"13px",background:rewardName?"rgba(90,120,72,0.10)":"rgba(248,245,236,0.95)",color:rewardName?"#3A6020":"#8A8070",border:`1.5px dashed ${rewardName?"rgba(90,120,72,0.3)":"rgba(90,80,60,0.2)"}`,borderRadius:100,fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                {data.reward?.photo&&<img src={data.reward.photo} alt="" style={{width:36,height:36,borderRadius:8,objectFit:"cover",flexShrink:0}}/>}
                <span>{rewardName?`🎁 ${rewardName}`:"+ Set your reward"}</span>
                <span style={{marginLeft:"auto",color:"#8A8070",fontSize:12}}>✏️</span>
              </button>
            )}
          </div>

          <div style={{background:MULTI,borderRadius:24,padding:"18px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"1px solid rgba(255,255,255,0.9)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:17,marginBottom:4}}>🗓️ The Plan</div>
            <div style={{fontSize:12,color:"#8A8070",marginBottom:14,lineHeight:1.6}}>Your tasks are listed below. Tap a day to assign each one — spread them across the week. Then send to your Week.</div>
            {(data.targetTasks||[]).filter(t=>t?.trim()).length===0?(
              <div style={{textAlign:"center",padding:"14px 0",color:"#8A8070",fontSize:13,fontStyle:"italic"}}>Add tasks in Today's Wipe Out above first</div>
            ):(
              <>
                {(data.targetTasks||[]).map((task,i)=>{ if(!task?.trim()) return null;
                  const assigned=plan.assignments[String(i)];
                  const steps=plan.steps?.[String(i)]||[];
                  const showSteps=plan.expandedSteps?.[String(i)];
                  return(
                    <div key={i} style={{background:MULTI,borderRadius:16,padding:"11px 14px",marginBottom:10,border:"1px solid rgba(90,120,72,0.12)"}}>
                      <div style={{fontSize:14,fontWeight:700,color:"#1A1A10",marginBottom:8}}>{task}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                        {DAYS.map((day,di)=>{
                          const sel=assigned===day;
                          return(
                            <button key={day} onClick={()=>savePlan({...plan,assignments:{...plan.assignments,[String(i)]:sel?null:day}})}
                              style={{padding:"5px 10px",borderRadius:100,fontSize:11,fontWeight:700,cursor:"pointer",background:sel?"#5A7848":"rgba(90,120,72,0.08)",color:sel?"#fff":"#5A7848",border:`1px solid ${sel?"#5A7848":"rgba(90,120,72,0.20)"}`,transition:"all 0.12s"}}>
                              {DAY_EMOJI[di]} {day.slice(0,3)}
                            </button>
                          );
                        })}
                      </div>
                      {assigned&&<div style={{fontSize:11,color:"#5A7848",fontWeight:600,marginBottom:6}}>→ {assigned}</div>}
                      <button onClick={()=>savePlan({...plan,expandedSteps:{...(plan.expandedSteps||{}),[String(i)]:!showSteps}})}
                        style={{background:"none",border:"none",color:"#8A8070",fontSize:11,fontWeight:600,cursor:"pointer",padding:"0",display:"flex",alignItems:"center",gap:4}}>
                        <span>{showSteps?"▼":"▶"}</span>
                        <span>{steps.length>0?`${steps.length} steps`:"Break into steps (optional)"}</span>
                      </button>
                      {showSteps&&(
                        <div style={{marginTop:8,paddingLeft:8,borderLeft:"2px solid rgba(90,120,72,0.20)"}}>
                          {steps.map((step,si)=>(
                            <div key={si} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                              <span style={{fontSize:11,color:"rgba(90,120,72,0.40)"}}>●</span>
                              <span style={{flex:1,fontSize:12,color:"#1A1A10"}}>{step}</span>
                              <button onClick={()=>{const ns=[...steps];ns.splice(si,1);savePlan({...plan,steps:{...(plan.steps||{}),[String(i)]:ns}});}}
                                style={{background:"none",border:"none",color:"#c0392b",cursor:"pointer",fontSize:11}}>✕</button>
                            </div>
                          ))}
                          <div style={{display:"flex",gap:6,marginTop:4}}>
                            <input placeholder="Add a step…"
                              style={{flex:1,padding:"6px 10px",borderRadius:100,border:"1px solid rgba(90,120,72,0.20)",fontSize:12,color:"#1A1A10",outline:"none",background:MULTI}}
                              onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){savePlan({...plan,steps:{...(plan.steps||{}),[String(i)]:[...steps,e.target.value.trim()]}});e.target.value="";}}}/>
                            <span style={{fontSize:10,color:"#8A8070",alignSelf:"center",flexShrink:0}}>↵</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {Object.values(plan.assignments).some(Boolean)&&(
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
                    <button onClick={()=>{
                      const weekTasks=DAYS.map(day=>({day,tasks:(data.targetTasks||[]).filter((t,i)=>t?.trim()&&plan.assignments[String(i)]===day)}));
                      try{localStorage.setItem('thinko_week_plan',JSON.stringify(weekTasks));}catch{}
                      showToast("📅 Sent to your Week!");
                    }} style={{width:"100%",padding:"12px",background:"#5A7848",color:"#fff",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:"0 2px 10px rgba(58,80,38,0.25)"}}>
                      📅 Send to My Week
                    </button>
                    <button onClick={()=>{
                      const assigned=(data.targetTasks||[]).map((t,i)=>({text:t,day:plan.assignments[String(i)]})).filter(x=>x.text?.trim()&&x.day);
                      const summary=assigned.map(x=>`${x.text} — ${x.day}`).join("\n");
                      navigator.clipboard?.writeText(summary);
                      const first=assigned[0];
                      if(first){
                        const di=DAYS.indexOf(first.day);
                        const now=new Date();const diff=((di-now.getDay()+8)%7)||7;
                        const d=new Date(now);d.setDate(now.getDate()+diff);
                        const pad=n=>String(n).padStart(2,"0");
                        const dt=`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
                        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("My Weekly Plan")}&dates=${dt}T090000/${dt}T100000&details=${encodeURIComponent(summary)}`,"_blank");
                      }
                      showToast("📋 Opening Google Calendar");
                    }} style={{width:"100%",padding:"12px",background:"rgba(66,133,244,0.10)",color:"#4285f4",border:"1.5px solid rgba(66,133,244,0.22)",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                      📅 Save to Google Calendar
                    </button>
                    <button onClick={()=>savePlan({tasks:[],assignments:{}})}
                      style={{width:"100%",padding:"8px",background:"transparent",color:"#8A8070",border:"none",fontSize:12,cursor:"pointer"}}>
                      🗑 Clear assignments
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{background:"linear-gradient(135deg,rgba(220,60,20,0.08),rgba(240,120,20,0.06))",borderRadius:24,padding:"18px 18px",marginBottom:14,boxShadow:"0 2px 14px rgba(0,0,0,0.05)",border:"2px solid rgba(220,60,20,0.18)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <span style={{fontSize:28}}>💥</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Georgia,serif",fontWeight:700,color:"#1A1A10",fontSize:17}}>Wipe Out Day Challenge</div>
                <div style={{fontSize:12,color:"#8A8070"}}>Pick a day to smash everything you've been putting off</div>
              </div>
              <button onClick={()=>setWipeExpanded(e=>!e)} style={{background:"rgba(220,60,20,0.10)",color:"#C03010",border:"1.5px solid rgba(220,60,20,0.20)",borderRadius:100,padding:"6px 14px",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                {wipeExpanded?"▲ Less":"▼ Set up"}
              </button>
            </div>

            {wipeDayData.date&&!wipeExpanded&&(
              <div style={{marginTop:8,padding:"8px 12px",background:"rgba(220,60,20,0.06)",borderRadius:14,border:"1px solid rgba(220,60,20,0.12)"}}>
                <div style={{fontSize:12,color:"#C03010",fontWeight:600}}>
                  📅 {new Date(wipeDayData.date+'T12:00:00').toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}
                  {isWipeDay&&<span style={{marginLeft:8,background:"#E04010",color:"#fff",borderRadius:100,padding:"1px 8px",fontSize:10}}>TODAY!</span>}
                </div>
                <div style={{fontSize:12,color:"#8A8070",marginTop:2}}>{wipeDayData.tasks.length} tasks · {wipeDayData.done.length} wiped out</div>
                {wipeDayData.tasks.length>0&&(
                  <div style={{height:4,background:"rgba(220,60,20,0.10)",borderRadius:100,overflow:"hidden",marginTop:6}}>
                    <div style={{height:"100%",width:`${wipePct}%`,background:wipePct===100?"#5A9840":"#E04010",borderRadius:100,transition:"width 0.4s"}}/>
                  </div>
                )}
              </div>
            )}

            {wipeExpanded&&(
              <div style={{marginTop:12}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:600,color:"#C03010",marginBottom:6}}>📅 Choose your Wipe Out Day</div>
                <input type="date" value={wipeDayData.date}
                  min={new Date().toISOString().slice(0,10)}
                  onChange={e=>saveWipeDay({...wipeDayData,date:e.target.value})}
                  style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",borderRadius:100,border:"1.5px solid rgba(220,60,20,0.25)",fontSize:14,color:"#1A1A10",outline:"none",marginBottom:12,background:MULTI}}/>

                <div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:600,color:"#C03010",marginBottom:8}}>💥 Tasks to wipe out</div>

                {(()=>{
                  const todayTasks=(data.targetTasks||[]).filter(t=>t?.trim());
                  const planTasks=(data.targetTasks||[]).filter((t,i)=>t?.trim()&&plan?.assignments?.[String(i)]).filter(t=>!wipeDayData.tasks.includes(t));
                  const allSuggested=[...new Set([...todayTasks,...planTasks])].filter(t=>!wipeDayData.tasks.includes(t));
                  if(!allSuggested.length) return null;
                  return(
                    <div style={{background:"rgba(220,60,20,0.05)",borderRadius:14,padding:"10px 12px",marginBottom:12,border:"1px solid rgba(220,60,20,0.12)"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#C03010",marginBottom:8,textTransform:"uppercase",letterSpacing:0.6}}>💡 From your tasks & plan — add to challenge?</div>
                      {allSuggested.map((task,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:i<allSuggested.length-1?"1px solid rgba(220,60,20,0.07)":"none"}}>
                          <span style={{flex:1,fontSize:13,color:"#1A1A10",fontWeight:500}}>{task}</span>
                          <button onClick={()=>saveWipeDay({...wipeDayData,tasks:[...wipeDayData.tasks,task]})}
                            style={{background:"rgba(220,60,20,0.12)",color:"#C03010",border:"1px solid rgba(220,60,20,0.20)",borderRadius:100,padding:"4px 12px",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>
                            + Add
                          </button>
                        </div>
                      ))}
                      <button onClick={()=>saveWipeDay({...wipeDayData,tasks:[...wipeDayData.tasks,...allSuggested]})}
                        style={{width:"100%",marginTop:8,padding:"8px",background:"#C03010",color:"#fff",border:"none",borderRadius:100,fontWeight:700,fontSize:12,cursor:"pointer"}}>
                        + Add all {allSuggested.length} tasks
                      </button>
                    </div>
                  );
                })()}

                <div style={{marginBottom:10}}>
                  {wipeDayData.tasks.map((task,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:4,borderRadius:12,background:wipeDayData.done.includes(task)?"rgba(90,160,80,0.08)":"rgba(255,255,255,0.70)",border:`1px solid ${wipeDayData.done.includes(task)?"rgba(90,160,80,0.20)":"rgba(220,60,20,0.10)"}`}}>
                      <button onClick={()=>{
                        const done=wipeDayData.done.includes(task);
                        saveWipeDay({...wipeDayData,done:done?wipeDayData.done.filter(d=>d!==task):[...wipeDayData.done,task]});
                      }} style={{width:26,height:26,borderRadius:"50%",border:`2px solid ${wipeDayData.done.includes(task)?"#5A9840":"rgba(220,60,20,0.35)"}`,background:wipeDayData.done.includes(task)?"#5A9840":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff"}}>
                        {wipeDayData.done.includes(task)?"✓":""}
                      </button>
                      <span style={{flex:1,fontSize:13,color:wipeDayData.done.includes(task)?"#8A9080":"#1A1A10",textDecoration:wipeDayData.done.includes(task)?"line-through":"none",fontWeight:600}}>{task}</span>
                      <button onClick={()=>saveWipeDay({...wipeDayData,tasks:wipeDayData.tasks.filter((_,j)=>j!==i),done:wipeDayData.done.filter(d=>d!==task)})}
                        style={{background:"rgba(192,57,43,0.08)",color:"#c0392b",border:"none",borderRadius:100,padding:"4px 8px",fontSize:11,cursor:"pointer",flexShrink:0}}>
                        🗑
                      </button>
                    </div>
                  ))}
                  {wipeDayData.tasks.length===0&&<div style={{fontSize:12,color:"#8A8070",fontStyle:"italic",padding:"8px 0"}}>No tasks yet — add the things you've been putting off most!</div>}
                </div>

                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  <input value={newWipeTask} onChange={e=>setNewWipeTask(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&newWipeTask.trim()){saveWipeDay({...wipeDayData,tasks:[...wipeDayData.tasks,newWipeTask.trim()]});setNewWipeTask("");}}}
                    placeholder="Add a task you've been putting off…"
                    style={{flex:1,padding:"10px 14px",borderRadius:100,border:"1.5px solid rgba(220,60,20,0.22)",fontSize:13,outline:"none",background:MULTI,color:"#1A1A10"}}/>
                  <button onClick={()=>{if(!newWipeTask.trim())return;saveWipeDay({...wipeDayData,tasks:[...wipeDayData.tasks,newWipeTask.trim()]});setNewWipeTask("");}}
                    style={{background:"#C03010",color:"#fff",border:"none",borderRadius:100,padding:"10px 18px",fontWeight:700,fontSize:14,cursor:"pointer"}}>+ Add</button>
                </div>

                {wipeDayData.tasks.length>0&&wipeDayData.date&&(
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <button onClick={()=>{
                      const dayName=new Date(wipeDayData.date+'T12:00:00').toLocaleDateString("en-GB",{weekday:"long"});
                      const weekTasks=DAYS.map(day=>({day,tasks:day===dayName?wipeDayData.tasks:[]}));
                      try{localStorage.setItem('thinko_week_plan',JSON.stringify(weekTasks));}catch{}
                      showToast("💥 Wipe Out Day sent to your Week!");
                    }} style={{width:"100%",padding:"12px",background:"#C03010",color:"#fff",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:"0 3px 12px rgba(192,48,16,0.30)"}}>
                      📅 Send to My Week
                    </button>
                    <button onClick={()=>{
                      const d=wipeDayData.date.replace(/-/g,"");
                      const details=`💥 WIPE OUT DAY!\n\nTasks to destroy:\n${wipeDayData.tasks.map(t=>`• ${t}`).join("\n")}`;
                      const url=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("💥 Wipe Out Day Challenge")}&dates=${d}T090000/${d}T200000&details=${encodeURIComponent(details)}`;
                      window.open(url,"_blank");
                      showToast("📅 Opening Google Calendar!");
                    }} style={{width:"100%",padding:"12px",background:"rgba(66,133,244,0.10)",color:"#4285f4",border:"1.5px solid rgba(66,133,244,0.22)",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                      📅 Save to Google Calendar
                    </button>
                    {isWipeDay&&(
                      <button onClick={()=>{
                        const merged=[...new Set([...(data.targetTasks||[]).filter(t=>t?.trim()),...wipeDayData.tasks])];
                        upd({targetTasks:merged,dailyTarget:merged.length});
                        showToast("💥 Wipe Out tasks loaded into today!");
                      }} style={{width:"100%",padding:"12px",background:MULTI,color:"#2A1A08",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:"0 3px 14px rgba(192,48,16,0.35)"}}>
                        💥 Load into Today — LET'S GO!
                      </button>
                    )}
                    <button onClick={()=>{saveWipeDay({date:"",tasks:[],done:[]});setWipeExpanded(false);}} style={{width:"100%",padding:"8px",background:"transparent",color:"#8A8070",border:"none",fontSize:12,cursor:"pointer"}}>🗑 Clear Wipe Out Day</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>}

      </div>
      <NavBar current="charge" setScreen={setScreen}/>
      {toast&&<div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",background:"rgba(42,56,28,0.92)",color:"#fff",borderRadius:100,padding:"11px 22px",fontWeight:700,fontSize:14,zIndex:500,whiteSpace:"nowrap",backdropFilter:"blur(8px)",boxShadow:"0 4px 20px rgba(0,0,0,0.18)"}}>{toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   🎲 DECISION MAKER — spin wheel, random pick, AI deep analysis
═══════════════════════════════════════════════════════ */
function DecisionMaker(){
  const [options,setOptions]=useState(["",""]);
  const [spinning,setSpinning]=useState(false);
  const [angle,setAngle]=useState(0);
  const [winner,setWinner]=useState(null);
  const [mode,setMode]=useState("wheel");
  const [flipResult,setFlipResult]=useState(null);
  const [flipping,setFlipping]=useState(false);
  const canvasRef=useRef(null);
  const COLOURS=["#E07060","#60A878","#6080C0","#C09040","#9060C0","#40A0A0","#C06080","#80A040"];

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas||options.length<2) return;
    const ctx=canvas.getContext("2d");
    const cx=canvas.width/2,cy=canvas.height/2,r=cx-8;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const filledOpts=options.filter(o=>o.trim());
    const slice=(2*Math.PI)/filledOpts.length;
    filledOpts.forEach((opt,i)=>{
      const start=angle*Math.PI/180+i*slice;
      const end=start+slice;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,end);ctx.closePath();
      ctx.fillStyle=COLOURS[i%COLOURS.length];ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.8)";ctx.lineWidth=2;ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.rotate(start+slice/2);
      ctx.textAlign="right";ctx.fillStyle="#fff";ctx.font="bold 13px Georgia";
      const label=opt.length>12?opt.slice(0,11)+"…":opt;
      ctx.fillText(label,r-10,5);ctx.restore();
    });
    ctx.beginPath();ctx.arc(cx,cy,18,0,2*Math.PI);
    ctx.fillStyle="#fff";ctx.fill();
    ctx.strokeStyle="rgba(90,80,60,0.3)";ctx.lineWidth=2;ctx.stroke();
  },[angle,options]);

  const spin=()=>{
    if(spinning||options.length<2) return;
    setWinner(null);setSpinning(true);
    const extraSpins=360*5+Math.random()*360;
    const duration=3500;
    const start=performance.now();
    const startAngle=angle;
    const easeOut=t=>1-Math.pow(1-t,4);
    const animate=(now)=>{
      const t=Math.min((now-start)/duration,1);
      const cur=startAngle+extraSpins*easeOut(t);
      setAngle(cur%360);
      if(t<1){requestAnimationFrame(animate);}
      else{
        const finalAngle=cur%360;
        const filled=options.filter(o=>o.trim());
        const slice=360/filled.length;
        const idx=Math.floor(((360-finalAngle%360)%360)/slice)%filled.length;
        setWinner(filled[idx]);setSpinning(false);
      }
    };
    requestAnimationFrame(animate);
  };

  const doFlip=()=>{
    if(flipping||options.length<2) return;
    setFlipping(true);setFlipResult(null);
    setTimeout(()=>{
      const f=options.filter(o=>o.trim());setFlipResult(f[Math.floor(Math.random()*f.length)]);
      setFlipping(false);
    },800);
  };

  return(
    <div style={{padding:"16px",paddingBottom:90}}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["wheel","flip"].map(m=>(
          <button key={m} onClick={()=>{setMode(m);setWinner(null);setFlipResult(null);}} style={{
            flex:1,padding:"10px",background:mode===m?MULTI:"rgba(255,255,255,0.40)",
            border:"1.5px solid rgba(180,160,140,0.35)",borderRadius:20,fontSize:14,fontWeight:700,
            color:"#2A1A08",cursor:"pointer",backdropFilter:"blur(8px)"
          }}>{m==="wheel"?"🎡 Spin Wheel":"🎲 Random Pick"}</button>
        ))}
      </div>

      <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:16,backdropFilter:"blur(8px)",border:"1.5px solid rgba(180,160,140,0.35)"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#2A1A08",flex:1}}>Your Options</div>
          <div style={{fontSize:12,color:"#8A8070"}}>{options.filter(o=>o.trim()).length} filled</div>
        </div>
        {options.map((o,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:COLOURS[i%COLOURS.length],flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{i+1}</div>
            <input
              value={o}
              onChange={e=>{const a=[...options];a[i]=e.target.value;setOptions(a);setWinner(null);}}
              placeholder={"Option "+(i+1)+"…"}
              style={{flex:1,padding:"10px 14px",borderRadius:12,border:"2px solid rgba(180,160,140,0.35)",fontSize:15,color:"#1A1A10",background:"rgba(255,255,255,0.75)",outline:"none",fontWeight:500}}/>
            {options.length>2&&(
              <button onClick={()=>{setOptions(options.filter((_,j)=>j!==i));setWinner(null);}}
                style={{background:"rgba(192,57,43,0.08)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,color:"rgba(192,57,43,0.70)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
            )}
          </div>
        ))}
        {options.length<8&&(
          <button onClick={()=>{setOptions([...options,""]);setWinner(null);}}
            style={{width:"100%",padding:"10px",background:"rgba(255,255,255,0.50)",border:"1.5px dashed rgba(180,160,140,0.40)",borderRadius:12,fontSize:14,fontWeight:600,color:"#5A7848",cursor:"pointer",marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            ＋ Add another option
          </button>
        )}
        {options.filter(o=>o.trim()).length<2&&(
          <div style={{fontSize:12,color:"#C09020",marginTop:8,textAlign:"center",fontWeight:600}}>⚠️ Add at least 2 options to spin</div>
        )}
      </div>

      {mode==="wheel"?(
        <div style={{textAlign:"center"}}>
          <div style={{position:"relative",display:"inline-block",marginBottom:12}}>
            <canvas ref={canvasRef} width={280} height={280} style={{borderRadius:"50%",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}/>
            <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",fontSize:28,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.3))"}}>▼</div>
          </div>
          <br/>
          <button onClick={spin} disabled={spinning||options.filter(o=>o.trim()).length<2}
            style={{padding:"16px 40px",background:spinning?"rgba(90,80,60,0.30)":"linear-gradient(135deg,#E07060,#C05040)",color:"#fff",border:"none",borderRadius:100,fontSize:18,fontWeight:800,cursor:spinning?"default":"pointer",boxShadow:"0 4px 20px rgba(192,80,64,0.35)",letterSpacing:0.5}}>
            {spinning?"Spinning...":"🎡 SPIN!"}
          </button>
          {winner&&(
            <div style={{marginTop:16,background:MULTI,borderRadius:20,padding:"20px",backdropFilter:"blur(8px)",border:"1.5px solid rgba(180,160,140,0.35)"}}>
              <div style={{fontSize:13,color:"#7A6A50",marginBottom:4,fontWeight:600}}>🎉 The wheel chose...</div>
              <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:28,color:"#2A1A08"}}>{winner}</div>
            </div>
          )}
        </div>
      ):(
        <div style={{textAlign:"center"}}>
          <button onClick={doFlip} disabled={flipping||options.filter(o=>o.trim()).length<2}
            style={{padding:"20px 40px",background:flipping?"rgba(90,80,60,0.30)":"linear-gradient(135deg,#6080C0,#4060A0)",color:"#fff",border:"none",borderRadius:100,fontSize:18,fontWeight:800,cursor:flipping?"default":"pointer",boxShadow:"0 4px 20px rgba(64,96,160,0.35)",marginBottom:16,letterSpacing:0.5}}>
            {flipping?"Thinking...":"🎲 Pick For Me!"}
          </button>
          {flipResult&&(
            <div style={{background:MULTI,borderRadius:20,padding:"24px",backdropFilter:"blur(8px)",border:"1.5px solid rgba(180,160,140,0.35)"}}>
              <div style={{fontSize:13,color:"#7A6A50",marginBottom:4,fontWeight:600}}>🎯 The decision is...</div>
              <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:32,color:"#2A1A08",marginBottom:8}}>{flipResult}</div>
              <button onClick={doFlip} style={{padding:"8px 20px",background:"rgba(90,80,60,0.12)",border:"1.5px solid rgba(180,160,140,0.35)",borderRadius:20,fontSize:13,fontWeight:600,color:"#5A4A30",cursor:"pointer"}}>Try again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── AI deep decision analysis — pros/cons weighted breakdown ── */
function AIDecisionAnalyser(){
  const [decision,setDecision]=useState("");
  const [pros,setPros]=useState([""]);
  const [cons,setCons]=useState([""]);
  const [context,setContext]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [activeTab,setActiveTab]=useState("input");

  const updatePro=(i,v)=>{const a=[...pros];a[i]=v;setPros(a);};
  const updateCon=(i,v)=>{const a=[...cons];a[i]=v;setCons(a);};
  const addPro=()=>setPros([...pros,""]);
  const addCon=()=>setCons([...cons,""]);
  const removePro=(i)=>setPros(pros.filter((_,j)=>j!==i));
  const removeCon=(i)=>setCons(cons.filter((_,j)=>j!==i));

  const analyse=async()=>{
    const cleanPros=pros.filter(p=>p.trim());
    const cleanCons=cons.filter(c=>c.trim());
    if(!decision.trim()){setError("Please describe what you're deciding.");return;}
    if(cleanPros.length===0&&cleanCons.length===0){setError("Please add at least one pro or con.");return;}
    setError("");setLoading(true);setResult(null);

    const prompt=`You are a wise, empathetic decision coach helping someone make an important decision.

DECISION: ${decision.trim()}
${context.trim()?`CONTEXT: ${context.trim()}`:""}
PROS: ${cleanPros.length>0?cleanPros.map((p,i)=>`${i+1}. ${p}`).join("\n"):"None listed"}
CONS: ${cleanCons.length>0?cleanCons.map((c,i)=>`${i+1}. ${c}`).join("\n"):"None listed"}

Analyse this decision deeply and respond in JSON only (no markdown, no backticks) with exactly this structure:
{
  "verdict": "Go for it" | "Think twice" | "It depends" | "Don't do it",
  "confidence": number 0-100,
  "summary": "2-3 sentence overall conclusion",
  "prosAnalysis": [{"point":"string","weight":"High|Medium|Low","insight":"string"}],
  "consAnalysis": [{"point":"string","weight":"High|Medium|Low","insight":"string"}],
  "hiddenFactors": ["string","string"],
  "questions": ["string","string"],
  "advice": "string - personal, warm, actionable final advice 2-3 sentences"
}`;

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data=await res.json();
      const text=data.content?.[0]?.text||"";
      const clean=text.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setResult(parsed);
      setActiveTab("result");
    }catch(e){
      setError("Analysis failed. Please try again.");
    }
    setLoading(false);
  };

  const verdictColor=(v)=>{
    if(v==="Go for it") return "#2A8A3A";
    if(v==="Think twice") return "#C09020";
    if(v==="Don't do it") return "#C03020";
    return "#4870A0";
  };
  const verdictEmoji=(v)=>{
    if(v==="Go for it") return "✅";
    if(v==="Think twice") return "⚠️";
    if(v==="Don't do it") return "❌";
    return "🤔";
  };
  const weightColor=(w)=>w==="High"?"#C03020":w==="Medium"?"#C09020":"#5A7848";

  return(
    <div style={{padding:"0 16px 90px"}}>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{id:"input",label:"📝 Decision"},{id:"result",label:"🧠 Analysis"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{flex:1,padding:"10px",background:activeTab===t.id?MULTI:"rgba(255,255,255,0.40)",
              border:"1.5px solid rgba(180,160,140,0.35)",borderRadius:20,fontSize:14,fontWeight:700,
              color:"#2A1A08",cursor:"pointer",backdropFilter:"blur(8px)",
              opacity:t.id==="result"&&!result?0.5:1}}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab==="input"&&(
        <div>
          <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:12,border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:8}}>🤔 What are you deciding?</div>
            <textarea value={decision} onChange={e=>setDecision(e.target.value)}
              placeholder="e.g. Should I change jobs? Should I move house? Should I buy this car?"
              style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",borderRadius:14,border:"1.5px solid rgba(180,160,140,0.40)",fontSize:14,color:"#1A1A10",background:"rgba(255,255,255,0.70)",outline:"none",resize:"none",minHeight:80,fontFamily:"Georgia,serif",lineHeight:1.5}}/>
          </div>

          <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:12,border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:8}}>📋 Any context? <span style={{fontWeight:400,fontSize:13,color:"#7A6A50"}}>(optional)</span></div>
            <textarea value={context} onChange={e=>setContext(e.target.value)}
              placeholder="e.g. I have two kids, limited savings, my current job is stressful…"
              style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",borderRadius:14,border:"1.5px solid rgba(180,160,140,0.40)",fontSize:14,color:"#1A1A10",background:"rgba(255,255,255,0.70)",outline:"none",resize:"none",minHeight:70,fontFamily:"Georgia,serif",lineHeight:1.5}}/>
          </div>

          <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:12,border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:10}}>✅ Pros</div>
            {pros.map((p,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                <span style={{color:"#5A7848",fontWeight:700,flexShrink:0}}>+</span>
                <input value={p} onChange={e=>updatePro(i,e.target.value)}
                  placeholder={"Pro "+(i+1)+"…"}
                  style={{flex:1,padding:"10px 12px",borderRadius:12,border:"1.5px solid rgba(180,160,140,0.40)",fontSize:14,color:"#1A1A10",background:"rgba(255,255,255,0.70)",outline:"none"}}/>
                {pros.length>1&&<button onClick={()=>removePro(i)} style={{background:"none",border:"none",color:"rgba(192,57,43,0.50)",cursor:"pointer",fontSize:18,flexShrink:0}}>✕</button>}
              </div>
            ))}
            <button onClick={addPro} style={{background:"rgba(90,120,72,0.10)",border:"1.5px dashed rgba(90,120,72,0.30)",borderRadius:12,padding:"8px 16px",fontSize:13,fontWeight:600,color:"#5A7848",cursor:"pointer",width:"100%"}}>+ Add pro</button>
          </div>

          <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:16,border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:10}}>❌ Cons</div>
            {cons.map((c,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                <span style={{color:"#C03020",fontWeight:700,flexShrink:0}}>−</span>
                <input value={c} onChange={e=>updateCon(i,e.target.value)}
                  placeholder={"Con "+(i+1)+"…"}
                  style={{flex:1,padding:"10px 12px",borderRadius:12,border:"1.5px solid rgba(180,160,140,0.40)",fontSize:14,color:"#1A1A10",background:"rgba(255,255,255,0.70)",outline:"none"}}/>
                {cons.length>1&&<button onClick={()=>removeCon(i)} style={{background:"none",border:"none",color:"rgba(192,57,43,0.50)",cursor:"pointer",fontSize:18,flexShrink:0}}>✕</button>}
              </div>
            ))}
            <button onClick={addCon} style={{background:"rgba(192,57,43,0.06)",border:"1.5px dashed rgba(192,57,43,0.25)",borderRadius:12,padding:"8px 16px",fontSize:13,fontWeight:600,color:"#C03020",cursor:"pointer",width:"100%"}}>+ Add con</button>
          </div>

          {error&&<div style={{padding:"12px",background:"rgba(192,57,43,0.10)",borderRadius:12,color:"#c0392b",fontSize:13,fontWeight:600,marginBottom:12}}>{error}</div>}

          <button onClick={analyse} disabled={loading}
            style={{width:"100%",padding:"16px",background:loading?"rgba(90,80,60,0.20)":"linear-gradient(135deg,#5A3888,#7A4AAA)",color:loading?"#8A8070":"#fff",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:17,cursor:loading?"default":"pointer",boxShadow:loading?"none":"0 4px 20px rgba(90,56,136,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            {loading?(
              <>
                <span style={{display:"inline-block",animation:"spin 1s linear infinite",fontSize:20}}>🔄</span>
                Analysing deeply…
              </>
            ):(
              <>🧠 Deep Analyse My Decision</>
            )}
          </button>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {activeTab==="result"&&result&&(
        <div>
          <div style={{background:"linear-gradient(135deg,rgba(230,200,180,0.95),rgba(210,195,220,0.95))",borderRadius:24,padding:"24px",marginBottom:14,border:"2px solid "+verdictColor(result.verdict)+"44",backdropFilter:"blur(8px)",textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:8}}>{verdictEmoji(result.verdict)}</div>
            <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:28,color:verdictColor(result.verdict),marginBottom:6}}>{result.verdict}</div>
            <div style={{fontSize:12,color:"#7A6A50",marginBottom:8,fontWeight:600}}>Confidence: {result.confidence}%</div>
            <div style={{height:8,background:"rgba(90,80,60,0.12)",borderRadius:100,overflow:"hidden",marginBottom:14}}>
              <div style={{height:"100%",width:result.confidence+"%",background:"linear-gradient(90deg,"+verdictColor(result.verdict)+","+verdictColor(result.verdict)+"99)",borderRadius:100,transition:"width 1s ease"}}/>
            </div>
            <div style={{fontSize:15,color:"#2A1A08",lineHeight:1.7,fontWeight:500}}>{result.summary}</div>
          </div>

          {result.prosAnalysis?.length>0&&(
            <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:12,border:"1.5px solid rgba(90,140,60,0.30)",backdropFilter:"blur(8px)"}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:10}}>✅ Pros — Deep Analysis</div>
              {result.prosAnalysis.map((p,i)=>(
                <div key={i} style={{padding:"10px 12px",background:"rgba(255,255,255,0.60)",borderRadius:12,marginBottom:8,border:"1px solid rgba(90,140,60,0.20)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#1A2810",flex:1}}>{p.point}</div>
                    <div style={{fontSize:10,fontWeight:700,color:weightColor(p.weight),background:weightColor(p.weight)+"15",padding:"2px 8px",borderRadius:20,flexShrink:0}}>{p.weight}</div>
                  </div>
                  <div style={{fontSize:12,color:"#5A4A30",lineHeight:1.5}}>{p.insight}</div>
                </div>
              ))}
            </div>
          )}

          {result.consAnalysis?.length>0&&(
            <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:12,border:"1.5px solid rgba(192,57,43,0.25)",backdropFilter:"blur(8px)"}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:10}}>❌ Cons — Deep Analysis</div>
              {result.consAnalysis.map((c,i)=>(
                <div key={i} style={{padding:"10px 12px",background:"rgba(255,255,255,0.60)",borderRadius:12,marginBottom:8,border:"1px solid rgba(192,57,43,0.15)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#1A2810",flex:1}}>{c.point}</div>
                    <div style={{fontSize:10,fontWeight:700,color:weightColor(c.weight),background:weightColor(c.weight)+"15",padding:"2px 8px",borderRadius:20,flexShrink:0}}>{c.weight}</div>
                  </div>
                  <div style={{fontSize:12,color:"#5A4A30",lineHeight:1.5}}>{c.insight}</div>
                </div>
              ))}
            </div>
          )}

          {result.hiddenFactors?.length>0&&(
            <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:12,border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)"}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:10}}>🔍 Hidden Factors to Consider</div>
              {result.hiddenFactors.map((f,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<result.hiddenFactors.length-1?"1px solid rgba(180,160,140,0.20)":"none"}}>
                  <span style={{color:"#7A5A90",flexShrink:0}}>◆</span>
                  <div style={{fontSize:13,color:"#2A1A08",lineHeight:1.5}}>{f}</div>
                </div>
              ))}
            </div>
          )}

          {result.questions?.length>0&&(
            <div style={{background:MULTI,borderRadius:20,padding:"16px",marginBottom:12,border:"1.5px solid rgba(180,160,140,0.35)",backdropFilter:"blur(8px)"}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:10}}>💭 Ask Yourself</div>
              {result.questions.map((q,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<result.questions.length-1?"1px solid rgba(180,160,140,0.20)":"none"}}>
                  <span style={{color:"#4870A0",flexShrink:0,fontWeight:700}}>{i+1}.</span>
                  <div style={{fontSize:13,color:"#2A1A08",lineHeight:1.5,fontStyle:"italic"}}>{q}</div>
                </div>
              ))}
            </div>
          )}

          {result.advice&&(
            <div style={{background:"linear-gradient(135deg,rgba(90,56,136,0.12),rgba(72,112,160,0.12))",borderRadius:20,padding:"18px",marginBottom:16,border:"1.5px solid rgba(90,56,136,0.25)",backdropFilter:"blur(8px)"}}>
              <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:"#1A2810",marginBottom:8}}>🌿 Final Advice</div>
              <div style={{fontSize:14,color:"#2A1A08",lineHeight:1.7}}>{result.advice}</div>
            </div>
          )}

          <button onClick={()=>{setResult(null);setActiveTab("input");setDecision("");setPros([""]);setCons([""]);setContext("");}}
            style={{width:"100%",padding:"13px",background:"rgba(90,80,60,0.10)",border:"1.5px solid rgba(180,160,140,0.35)",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,color:"#5A4A30",cursor:"pointer"}}>
            🔄 Start a New Decision
          </button>
        </div>
      )}

      {activeTab==="result"&&!result&&(
        <div style={{textAlign:"center",padding:"60px 20px",color:"#8A8070"}}>
          <div style={{fontSize:48,marginBottom:12}}>🧠</div>
          <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:18,color:"#1A1A10",marginBottom:8}}>No analysis yet</div>
          <div style={{fontSize:13,lineHeight:1.6}}>Fill in your decision, pros and cons on the Decision tab, then tap Analyse.</div>
          <button onClick={()=>setActiveTab("input")} style={{marginTop:16,padding:"12px 24px",background:"linear-gradient(135deg,#5A3888,#7A4AAA)",color:"#fff",border:"none",borderRadius:100,fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>Go to Decision →</button>
        </div>
      )}
    </div>
  );
}

/* ── Decision Maker screen — tabs for Spin & Pick / Deep Analysis ── */
function DecisionScreen({setScreen}){
  const [tab,setTab]=useState("spin");
  return(
    <div style={{position:"relative",zIndex:10,minHeight:"100vh"}}>
      <div style={{background:MULTI,backdropFilter:"blur(16px)",padding:"14px 18px 0",borderBottom:"1px solid rgba(180,160,140,0.35)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="#2A1A08" strokeWidth="2.2" strokeLinecap="round"/></svg>
          </button>
          <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:20,color:"#2A1A08",flex:1}}>Decision Maker</div>
        </div>
        <div style={{display:"flex",gap:0,borderBottom:"none"}}>
          <button onClick={()=>setTab("spin")}
            style={{flex:1,padding:"10px 8px",background:"none",border:"none",borderBottom:tab==="spin"?"3px solid #5A3888":"3px solid transparent",fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,color:tab==="spin"?"#5A3888":"#7A6A50",cursor:"pointer"}}>
            🎡 Spin & Pick
          </button>
          <button onClick={()=>setTab("analyse")}
            style={{flex:1,padding:"10px 8px",background:"none",border:"none",borderBottom:tab==="analyse"?"3px solid #5A3888":"3px solid transparent",fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,color:tab==="analyse"?"#5A3888":"#7A6A50",cursor:"pointer"}}>
            🧠 Deep Analysis
          </button>
        </div>
      </div>
      <div style={{paddingTop:8}}>
        {tab==="spin"&&<DecisionMaker/>}
        {tab==="analyse"&&<AIDecisionAnalyser/>}
      </div>
      <NavBar current="decision" setScreen={setScreen}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   🏠 HOME — draggable tile hub for the 4 sections
═══════════════════════════════════════════════════════ */
const HOME_TILES=[
  {id:"goals",   icon:"🎯", name:"Goals",    summary:"Plan your future, step by step", color:"#5A7848"},
  {id:"mindmap", icon:"🧠", name:"Mind Map",  summary:"Branch out your ideas",          color:"#6A5870"},
  {id:"charge",  icon:"⚡", name:"Wipe Out",  summary:"Tackle what you've avoided",     color:"#C03010"},
  {id:"decision",icon:"🎲", name:"Decide",    summary:"Spin, flip, or deep analyse",    color:"#4870A0"},
];

function Home({setScreen}){
  const [tileOrder,setTileOrderRaw]=useState(()=>{
    try{const s=localStorage.getItem('thinkogoals_tile_order');return s?JSON.parse(s):null;}catch{return null;}
  });
  const [dragTile,setDragTile]=useState(null);
  const [dragOverTile,setDragOverTile]=useState(null);
  const saveTileOrder=o=>{setTileOrderRaw(o);try{localStorage.setItem('thinkogoals_tile_order',JSON.stringify(o));}catch{}};

  const orderedTiles=tileOrder
    ? tileOrder.map(id=>HOME_TILES.find(t=>t.id===id)).filter(Boolean).concat(HOME_TILES.filter(t=>!tileOrder.includes(t.id)))
    : HOME_TILES;

  const onTileDrop=(toId)=>{
    if(!dragTile||dragTile===toId)return;
    const ids=orderedTiles.map(t=>t.id);
    const fi=ids.indexOf(dragTile),ti=ids.indexOf(toId);
    ids.splice(fi,1);ids.splice(ti,0,dragTile);
    saveTileOrder(ids);
  };

  return(
    <div style={{minHeight:"100vh",background:"transparent",fontFamily:"'Segoe UI',sans-serif",paddingBottom:90}}>
      <div style={{
        background:MULTI,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
        padding:"26px 20px 20px",textAlign:"center",
        borderBottom:"1px solid rgba(90,80,60,0.08)",
        position:"sticky",top:0,zIndex:50,
      }}>
        <div style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:700,color:"#1A1A10",letterSpacing:-0.5,display:"inline-flex",alignItems:"center",gap:10}}>
          ThinkoGoals <img src="/image.png" alt="Thinko the Hedgehog" style={{width:34,height:34,borderRadius:10,objectFit:"cover"}}/>
        </div>
        <div style={{fontSize:13,color:"#5A4A30",marginTop:4,fontWeight:500}}>Think it · Plan it · Live it</div>
      </div>

      <div style={{padding:"12px 0 0"}}>
        <InstallAppButton/>
      </div>

      <div style={{padding:"18px 16px 8px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {orderedTiles.map(t=>(
          <div key={t.id}
            draggable
            onDragStart={()=>setDragTile(t.id)}
            onDragOver={e=>{e.preventDefault();setDragOverTile(t.id);}}
            onDragLeave={()=>setDragOverTile(null)}
            onDrop={()=>{onTileDrop(t.id);setDragTile(null);setDragOverTile(null);}}
            onDragEnd={()=>{setDragTile(null);setDragOverTile(null);}}
            onClick={()=>setScreen(t.id)}
            style={{
              background:dragOverTile===t.id?"rgba(90,120,72,0.15)":MULTI,
              borderRadius:22,padding:"20px 16px",
              border:`1.5px solid ${dragOverTile===t.id?"rgba(90,120,72,0.40)":"rgba(255,255,255,0.7)"}`,
              boxShadow:"0 4px 16px rgba(60,70,40,0.12)",
              cursor:"grab",textAlign:"center",
              display:"flex",flexDirection:"column",alignItems:"center",gap:8,
              transition:"background 0.15s",
            }}>
            <span style={{fontSize:40}}>{t.icon}</span>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:"#1A1A10"}}>{t.name}</div>
            <div style={{fontSize:11,color:"#5A4A30",opacity:0.8,lineHeight:1.3}}>{t.summary}</div>
            <div style={{width:32,height:3,borderRadius:2,background:t.color,marginTop:2}}/>
          </div>
        ))}
      </div>

      <div style={{padding:"6px 20px",textAlign:"center",fontSize:11,color:"rgba(90,80,60,0.5)"}}>
        Press and drag a tile to reorder
      </div>

      <NavBar current="home" setScreen={setScreen}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   APP — top-level screen router + shared persisted state
═══════════════════════════════════════════════════════ */
export default function ThinkoGoalsApp(){
  const [screen,setScreen]=useState("home");

  const [goalsData,setGoalsData]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('thinkogoals_goals')||'[]');}catch{return [];}
  });
  useEffect(()=>{try{localStorage.setItem('thinkogoals_goals',JSON.stringify(goalsData));}catch{}},[goalsData]);

  const [mapData,setMapData]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('thinkogoals_mindmap')||'[]');}catch{return [];}
  });
  useEffect(()=>{try{localStorage.setItem('thinkogoals_mindmap',JSON.stringify(mapData));}catch{}},[mapData]);

  /* Bridge: Goals/MindMap "Send to Wipe Out" pushes a task straight into
     today's Wipe Out task list (stored under the same key TheCharge reads). */
  const sendToWipeOut=(text)=>{
    if(!text?.trim())return;
    try{
      const raw=JSON.parse(localStorage.getItem('thinkogoals_charge')||'null')||{dailyTarget:3,weeklyAward:"",rewardType:"weekly",rewardFreq:5,reward:{name:"",cost:"",url:"",photo:""},days:{},streak:0};
      const next={...raw,targetTasks:[...(raw.targetTasks||[]).filter(t=>t?.trim()),text.trim()]};
      next.dailyTarget=Math.max(next.dailyTarget||3,next.targetTasks.length);
      localStorage.setItem('thinkogoals_charge',JSON.stringify(next));
    }catch{}
  };

  return(
    <div style={{minHeight:"100vh",background:"#F0EBE0"}}>
      {screen==="home"&&<Home setScreen={setScreen}/>}
      {screen==="goals"&&<Goals data={goalsData} setData={setGoalsData} setScreen={setScreen} onSendToWipeOut={sendToWipeOut}/>}
      {screen==="mindmap"&&<MindMap data={mapData} setData={setMapData} setGoalsData={setGoalsData} onSendToWipeOut={sendToWipeOut} setScreen={setScreen}/>}
      {screen==="charge"&&<TheCharge setScreen={setScreen}/>}
      {screen==="decision"&&<DecisionScreen setScreen={setScreen}/>}
    </div>
  );
}
