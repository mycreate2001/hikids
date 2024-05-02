import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
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

  constructor(private http:HttpClient) {
    this._restore();
  }
  private _getLink(text:string){
    const url="/fpt"
    return this.http.post<FptRespond>(url,text)
  }

  config(setting:Partial<FptAiSetting>){
    Object.assign(this.setting,setting);
    this._backup();
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
      text=text.split(" ").filter(x=>!!x).join(" ")

      // already getvoice -->just speak
      const length=this.buffers.length;
      this.buffers=this.buffers.filter(b=>!checkExpire(b));
      if(this.buffers.length!==length) this._backup();

      const buff=this.buffers.find(b=>b.text===text)
      if(buff) {
        this.getVoice(buff.url);
        return resolve(text);
      }
     
      // new request
      this._getLink(text).subscribe(res=>{
        if(res.error){
          console.log(res);
          return;
        }
        const url=res.async;
        const buff:AudioBuffer={url,text,createAt:Date.now()}
        this.buffers.push(buff);
        this._backup();
        this.getVoice(url)
      })
    })
  }


  /** get voice from server */
  getVoice(src:string){
    const audio =new Audio();
    audio.autoplay=true;
    audio.src=src;
    audio.addEventListener("loadeddata",()=>audio.play())
  }
}



function checkExpire(buff:AudioBuffer):boolean{
  const now=Date.now();
  if((now-buff.createAt)<=_EXP_TIME) return false;
  return true;
}


export interface FptAiSetting{
  voice:string;
  speed:string;
  volume:string;
}

function createFptAiSetting(...opts:Partial<FptAiSetting>[]):FptAiSetting{
  const df:FptAiSetting={
    voice:'banmai',
    speed:'1',
    volume:'1'
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
}
