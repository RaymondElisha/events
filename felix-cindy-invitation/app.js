const defaults = {
  firstName:"Felix", secondName:"Cindy", guestName:"Mr. Raymond Nuwamanya", guestCount:"1", code:"kh8ayj",
  dateISO:"2026-10-08T10:00", dateDisplay:"Thursday · 8 October 2026", dateShort:"08 · 10 · 2026",
  ceremonyTime:"10:00 AM", ceremonyName:"St Charles Lwanga, Ntinda Parish", ceremonyLocation:"Ntinda, Kampala",
  ceremonyMap:"https://www.google.com/maps/search/?api=1&query=St+Charles+Lwanga+Ntinda+Parish",
  receptionTime:"3:00 PM", receptionName:"Akaama Resort", receptionLocation:"Kira, Wakiso",
  receptionMap:"https://www.google.com/maps/search/?api=1&query=Akaama+Resort+Kira",
  photo1:"", photo2:"",
  giftNote:"Sharing our day with you means the most to us. If you would like to give something more, a small, easy-to-carry gift or a cash contribution would be warmly appreciated as we begin our married life abroad.",
  adultsNote:"We love your children, and kindly ask that both the church ceremony and reception be attended by adults only.",
  verse:"“Let all that you do be done in love.”", verseRef:"1 Corinthians 16:14"
};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const lerp=(a,b,t)=>a+(b-a)*clamp(t);
const ease=t=>1-Math.pow(1-clamp(t),3);

function decodeShared(){
  try{
    const p=new URLSearchParams(location.search).get("d");
    return p?JSON.parse(decodeURIComponent(escape(atob(p)))):{};
  }catch(e){return {}}
}
const local = (()=>{try{return JSON.parse(localStorage.getItem("felixCindyInvite")||"{}")}catch{return {}}})();
let data = {...defaults,...local,...decodeShared()};

function formatDates(){
  const d = new Date(data.dateISO);
  if(!Number.isNaN(d.getTime())){
    data.dateDisplay = new Intl.DateTimeFormat("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(d).replace(",","");
    data.dateShort = new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d).replaceAll("/"," · ");
  }
}
function applyData(){
  formatDates();
  $$("[data-bind]").forEach(el=>{
    const k=el.dataset.bind;
    if(k in data) el.textContent=data[k];
  });
  $("#monogram").innerHTML=`${(data.firstName||"F")[0]} <span>&</span> ${(data.secondName||"C")[0]}`;
  $("#sealLetters").textContent=`${(data.firstName||"F")[0]}&${(data.secondName||"C")[0]}`;
  $$("[data-link]").forEach(a=>a.href=data[a.dataset.link]||"#");
  [["photo1","#photoFrame1","#photo1"],["photo2","#photoFrame2","#photo2"]].forEach(([k,frame,img])=>{
    const f=$(frame), i=$(img);
    if(data[k]){i.src=data[k];f.classList.add("has-photo")}else{f.classList.remove("has-photo");i.removeAttribute("src")}
  });
  fillForm();
}
function fillForm(){
  const form=$("#editorForm");
  [...form.elements].forEach(el=>{if(el.name && el.name in data) el.value=data[el.name]??""});
}
function readForm(){
  const form=$("#editorForm");
  [...form.elements].forEach(el=>{if(el.name) data[el.name]=el.value});
  applyData();
}
$("#editorForm").addEventListener("input",readForm);

const experience=$("#experience"), topFlap=$("#flapTop"), rightFlap=$("#flapRight"), bottomFlap=$("#flapBottom"), leftFlap=$("#flapLeft"), seal=$("#seal"), closedCopy=$("#closedCopy"), card=$("#innerCardShell"), rail=$("#cardRail"), progressBar=$("#progressBar");
function stageProgress(){
  const max=experience.offsetHeight-innerHeight;
  return clamp(-experience.getBoundingClientRect().top/Math.max(1,max));
}
function render(){
  const p=stageProgress();
  const open=ease(clamp(p/0.19));
  topFlap.style.transform=`rotateX(${lerp(0,112,open)}deg) translateY(${lerp(0,-8,open)}%)`;
  bottomFlap.style.transform=`rotateX(${lerp(0,-112,open)}deg) translateY(${lerp(0,8,open)}%)`;
  leftFlap.style.transform=`rotateY(${lerp(0,-112,open)}deg) translateX(${lerp(0,-8,open)}%)`;
  rightFlap.style.transform=`rotateY(${lerp(0,112,open)}deg) translateX(${lerp(0,8,open)}%)`;
  const fade=clamp(open*1.5);
  seal.style.opacity=1-fade; seal.style.transform=`translate(-50%,-50%) scale(${lerp(1,.45,fade)})`;
  closedCopy.style.opacity=1-fade; closedCopy.style.transform=`translate(-50%,calc(-50% + ${lerp(0,20,fade)}px))`;
  const cardIn=ease(clamp((p-.08)/.14));
  card.style.opacity=cardIn; card.style.transform=`scale(${lerp(.86,1,cardIn)}) translateY(${lerp(3,0,cardIn)}vh)`;
  const inner=clamp((p-.21)/.79);
  const sections=6;
  rail.style.transform=`translateY(${-inner*(sections-1)*100}vh)`;
  progressBar.style.width=`${p*100}%`;
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

function updateCountdown(){
  const target=new Date(data.dateISO).getTime();
  const diff=Math.max(0,target-Date.now());
  const day=86400000,hour=3600000,min=60000;
  $("#days").textContent=String(Math.floor(diff/day)).padStart(2,"0");
  $("#hours").textContent=String(Math.floor((diff%day)/hour)).padStart(2,"0");
  $("#minutes").textContent=String(Math.floor((diff%hour)/min)).padStart(2,"0");
  $("#seconds").textContent=String(Math.floor((diff%min)/1000)).padStart(2,"0");
}
setInterval(updateCountdown,1000);updateCountdown();

function openEditor(){
  $("#editor").classList.add("open");$("#editor").setAttribute("aria-hidden","false");$("#editorBackdrop").hidden=false;
}
function closeEditor(){
  $("#editor").classList.remove("open");$("#editor").setAttribute("aria-hidden","true");$("#editorBackdrop").hidden=true;
}
$("#editButton").addEventListener("click",openEditor);$("#closeEditor").addEventListener("click",closeEditor);$("#editorBackdrop").addEventListener("click",closeEditor);
$("#saveLocal").addEventListener("click",()=>{
  readForm();localStorage.setItem("felixCindyInvite",JSON.stringify(data));$("#editorStatus").textContent="Saved on this device.";
});
$("#resetData").addEventListener("click",()=>{
  data={...defaults};localStorage.removeItem("felixCindyInvite");history.replaceState({},document.title,location.pathname);applyData();$("#editorStatus").textContent="Reset to the original invitation.";
});
$("#shareLink").addEventListener("click",async()=>{
  readForm();
  const raw=btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const url=`${location.origin}${location.pathname}?d=${encodeURIComponent(raw)}`;
  try{await navigator.clipboard.writeText(url);$("#editorStatus").textContent="Share link copied to clipboard."}catch{$("#editorStatus").textContent=url}
});
$("#backToTop").addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));

function icsDate(d){
  return d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
}
$("#calendarButton").addEventListener("click",()=>{
  const start=new Date(data.dateISO), end=new Date(start.getTime()+9*3600000);
  const text=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Felix & Cindy//Wedding//EN","BEGIN:VEVENT",`DTSTART:${icsDate(start)}`,`DTEND:${icsDate(end)}`,`SUMMARY:${data.firstName} & ${data.secondName} Wedding`,`LOCATION:${data.ceremonyName}, ${data.ceremonyLocation}`,`DESCRIPTION:Church: ${data.ceremonyTime} at ${data.ceremonyName}. Reception: ${data.receptionTime} at ${data.receptionName}.`,"END:VEVENT","END:VCALENDAR"].join("\r\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/calendar"}));a.download="felix-cindy-wedding.ics";a.click();URL.revokeObjectURL(a.href);
});
$("#downloadButton").addEventListener("click",()=>window.print());
applyData();
