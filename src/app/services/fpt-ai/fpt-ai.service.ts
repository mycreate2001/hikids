import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FptAiService {

  constructor(private http:HttpClient) { }
  
  private _convert2Speed(text:string,opts:Partial<FptAiSetting>={}){
    const setting=createFptAiSetting(opts);
    const url="/fpt"
    // const url1="https://api.fpt.ai/tts/v5/synthesize"
    // const ACCESS_TOKEN='9LCVPdWPF0FE8vFNYeUYIlbLW97WHB6B'
    return this.http.post<FptRespond>(url,text)
  }

  tts(text:string,opts:Partial<FptAiSetting>={}){
    return this._convert2Speed(text,opts)
  }

  playAudio(data:string){
    console.log("data:",data);
    const audio=new Audio();
    audio.autoplay=true;
    audio.src=data;
    audio.play().then(result=>{
      console.log("play success ",result)
    })
    .catch(err=>{console.log("play error ", err)})
  }

  player(url:string){
    const audio =new Audio();
    audio.autoplay=true;
    audio.src=url;
    return audio;
  }
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
