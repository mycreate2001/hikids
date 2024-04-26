import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private setting:TextToSpeechSetting=createTextToSpeechSetting();
  private synth!:SpeechSynthesis;           // speaker
  voices:Array<SpeechSynthesisVoice>=[];    // list of voice
  voice!:SpeechSynthesisVoice;              // current voice
  
  public selectedVoice!:SpeechSynthesisUtterance;

  constructor() {
    this.init();
    console.log("/*** init of tts ***/\n",this);
  }

  private async init(){
    if('speechSynthesis' in window){
      this.synth=window.speechSynthesis;
      //get voices list
      this.voices=await this.getVoices();
      //voice
      this.config();
      return;
    }

    /// error
    console.log("Your browser not support TTS");
  }

  /**
   * The function `getVoices` is an asynchronous function that returns a promise which resolves to an
   * array of `SpeechSynthesisVoice` objects.
   * @returns a Promise that resolves to an array of SpeechSynthesisVoice objects.
   */
  async getVoices():Promise<Array<SpeechSynthesisVoice>>{
    return new Promise((resolve,reject)=>{
      try{
        if(!this.synth) throw new Error("Not support")
          setTimeout(()=>{
            const voices=this.synth.getVoices();
            // console.log("voices:",voices)
            return resolve(voices)
        },1)
      }
      catch(err){
        return reject(err);
      }
    })
  }

  grapVoice(voice:string):SpeechSynthesisVoice{
    let selectVoice!:SpeechSynthesisVoice;
    for(let i=0;i<this.voices.length;i++){
      if(this.voices[i].name===voice){
        selectVoice=this.voices[i];
        break;
      }
    }
    return selectVoice;
  }


  speak(textContent:string, opts?:Partial<TextToSpeechSetting>){
    return new Promise((resolve)=>{
      const speakSpcs:SpeechSynthesisUtterance=new SpeechSynthesisUtterance(textContent);
      // Object.assign(speakSpcs,this.setting,opts,{voice:this.voices[0]});
      const setting:TextToSpeechSetting=Object.assign({},this.setting,opts);
      speakSpcs.pitch=setting.pitch;
      speakSpcs.volume=setting.volume;
      speakSpcs.lang=setting.lang;
      speakSpcs.rate=setting.rate;
      speakSpcs.onend=()=>resolve(textContent)
      if(setting.voice) {
        speakSpcs.voice=this.voices.find(x=>x.name===setting.voice)||this.voices[0];
      }
      else { 
        speakSpcs.voice=this.voices.find(x=>x.lang===setting.lang)||this.voices[0];
      }
      this.synth.speak(speakSpcs)
      })
  }

  config(opts?:Partial<TextToSpeechSetting>){
    Object.assign(this.setting,opts);
  }
  
}


//////////////////////

export interface TextToSpeechSetting{
  lang:string;
  pitch:number;                // 0~1 default=1
  volume:number;              //0~1 default=1
  rate:number;                // rate of speech
  voice:string;               //
}

export const TextToSpeechSettingDefault:TextToSpeechSetting={
  lang:'vi-VN',
  pitch:1,
  volume:1,
  rate:1,
  voice:''
}

export function createTextToSpeechSetting(setting?:Partial<TextToSpeechSetting>):TextToSpeechSetting{
  return Object.assign({},TextToSpeechSettingDefault,setting)
}

