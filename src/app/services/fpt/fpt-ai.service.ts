import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { timeout } from 'rxjs';
// import { Observable } from 'rxjs';
const _BACKUP_LIST=["buffers","setting"];
const _DB_TTS="tts_buffers"
const _EXP_TIME=24*3600*1000;//ms

@Injectable({
  providedIn: 'root'
})
export class FptAiService {
  setting:FptAiSetting=createFptAiSetting();
  buffers:AudioBuffer[]=[]
  text:string='';//current text
  constructor(private http:HttpClient) {
    this._restore();
  }
  private _getLink(text:string){
    const url="/fpt"
    const body={text,...this.setting}
    return this.http.post<FptRespond>(url,body).pipe(timeout(6000))
  }

  config(setting:Partial<FptAiSetting>){
    Object.assign(this.setting,setting);
    this._backup();
  }

  getVoices(){
    const arrs=[{n:"Ban Mai (Nữ miền Bắc)",v:"banmai"},
      {n:"Lê Minh (Nam miền Bắc)",v:"leminh"},
      {n:"Thu Minh (Nữ miền Bắc)",v:"thuminh"},
      {n:"Linh San (Nữ miền Nam)",v:"linhsan"},
      {n:"Lan Nhi (Nữ miền Nam)",v:"lannhi"},
    ]
    return arrs;
  }

  private _backup(){
    const data:any={};
    _BACKUP_LIST.forEach(key=>{
      const val=(this as any)[key];
      if(val!==undefined) data[key]=val;
    })
    localStorage.setItem(_DB_TTS,JSON.stringify(data))
  }

  private _restore(){
    try{
      const str=localStorage.getItem(_DB_TTS);
      if(!str) return;
      const data=JSON.parse(str);
      Object.assign(this,data)
    }
    catch(err){
      console.log("restore error ",err);
    }
  }

 

  /** speak */
  speak(text:string,opts:Partial<FptAiSetting>={}):Promise<string>{
    return new Promise((resolve,reject)=>{
      // change setting
      if(Object.keys(opts).length) this.config(opts);
      
      //correct text
      text=text.toLowerCase().split(/[ ,\-.:;!?]/g).filter(x=>!!x).join(" ")
      this.text=text;
      // already getvoice -->just speak
      const length=this.buffers.length;
      this.buffers=this.buffers.filter(b=>!checkExpire(b));
      if(this.buffers.length!==length) this._backup();

      const buff=this.buffers.find(b=>matchBuffer(b,{text,...this.setting}))
      if(buff) {
        this._playAudio(buff.url);
        return resolve(text);
      }
     
      // new request
      this._getLink(text)
      .subscribe(res=>{
        if(!res||res.error){
          console.warn(res);
          return;
        }
        const url=res.async;
        console.log(`url of '${text}':`,url)
        const buff:AudioBuffer={
                        text,
                        url,
                        createAt:Date.now(),
                        voice:this.setting.voice,
                        speed:this.setting.speed
                      }
        this.buffers.push(buff);
        this._backup();
        setTimeout(()=>this._playAudio(url),1000)
      },
      err=>console.log("error ",err)
      )
    })
  }


  /** get voice from server */
  private _playAudio(src:string){
    let time=Date.now();
    console.log("[_playAudio] start")
    const audio =new Audio();
    audio.autoplay=true;
    audio.src=src;
    audio.addEventListener("canplay",()=>{
      time=Date.now()-time;
      console.log("[_playAudio] play %s",time);
      audio.play()
    })
    audio.addEventListener("abort",(e)=>{
      console.log(`### cancel text '${this.text}' \nERROR:`,e)
    })
    // audio.addEventListener("loadeddata",()=>{
    //   time=Date.now()-time;
    //   console.log("[_playAudio] play %s",time);
    //   audio.play()
    // })

    // setTimeout(()=>{audio.play()},4000)
  }
}



function checkExpire(buff:AudioBuffer):boolean{
  const now=Date.now();
  if((now-buff.createAt)<=_EXP_TIME) return false;
  return true;
}

function matchBuffer(buff:AudioBuffer,setting:{voice:string,speed:number,text:string}):boolean{
  if(buff.text.toLowerCase()!==setting.text.toLowerCase()) return false;
  if(buff.speed!==setting.speed) return false;
  if(buff.voice!==setting.voice) return false;
  return true;
}


export interface FptAiSetting{
  voice:string;
  speed:number;
  volume:number;
}

function createFptAiSetting(...opts:Partial<FptAiSetting>[]):FptAiSetting{
  const df:FptAiSetting={
    voice:'banmai',
    speed:-1,
    volume:1
  }
  return Object.assign(df,...opts)
}

export interface FptRespond{
  async:string;
  error:number;
  message:string;
  request_id:string;
}

interface AudioBuffer{
  text:string;
  url:string;
  createAt:number;
  voice:string;
  speed:number;
}
