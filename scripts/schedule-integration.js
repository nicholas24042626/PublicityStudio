'use strict';

function applyImportedSchedule(schedule){
  info=Object.assign(blank(),{
    title:String(schedule.title||'').slice(0,160),
    description:String(schedule.description||'').slice(0,1500),
    date:String(schedule.date||''),
    startTime:String(schedule.start_time||schedule.startTime||''),
    endTime:String(schedule.end_time||schedule.endTime||''),
    venue:String(schedule.venue||'').slice(0,240),
    audience:String(schedule.audience||'').slice(0,240),
    registration:String(schedule.registration||'').slice(0,600),
    slots:String(schedule.slots||''),
    category:String(schedule.category||'Community'),
    languages:['English'],translations:{}
  });
  selected=['poster'];step=1;render();toast('Schedule imported. Review the details before generating.');
}

function decodeLocalSchedule(encoded){
  const base64=encoded.replace(/-/g,'+').replace(/_/g,'/');
  const bytes=Uint8Array.from(atob(base64),character=>character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function generateScheduleArtwork(ticket){
  const response=await fetch('/api/generate-artwork',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ticket})});
  const data=await response.json();
  if(!response.ok||!data.image)throw new Error(data.error||'Artwork generation failed.');
  image=data.image;generated=generateMaterials(['poster']);step=3;render();toast('AI artwork and poster are ready.');
}

async function importScheduleFromUrl(){
  const params=new URLSearchParams(location.search),ticket=params.get('ticket'),localSchedule=params.get('schedule');
  if(!ticket&&!localSchedule)return;
  try{
    let schedule,autoGenerate=false;
    if(ticket){const response=await fetch(`/api/schedule?ticket=${encodeURIComponent(ticket)}`),data=await response.json();if(!response.ok)throw new Error(data.error||'Schedule link is invalid.');schedule=data.schedule;autoGenerate=Boolean(data.auto_generate)}
    else schedule=decodeLocalSchedule(localSchedule);
    history.replaceState({},'',location.pathname);
    applyImportedSchedule(schedule);
    if(ticket&&autoGenerate){toast('Generating poster artwork…');await generateScheduleArtwork(ticket)}
  }catch(error){toast(`Could not import schedule: ${error.message}`)}
}
