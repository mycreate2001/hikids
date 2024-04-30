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

  /**
   * The function `grapVoice` in TypeScript selects a specific `SpeechSynthesisVoice` based on the
   * provided voice name.
   * @param {string} voice - The `voice` parameter in the `grapVoice` function is a string that
   * represents the name of a specific SpeechSynthesisVoice that you want to retrieve from a list of
   * available voices.
   * @returns The `grapVoice` function is returning a `SpeechSynthesisVoice` object that matches the
   * input `voice` string provided as a parameter.
   */
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


  /**
   * The `speak` function in TypeScript uses the Web Speech API to convert text content to speech with
   * customizable settings.
   * @param {string} textContent - The `textContent` parameter is a string that represents the text
   * content that you want to be spoken out loud using text-to-speech technology.
   * @param [opts] - The `opts` parameter in the `speak` function is an optional parameter that allows
   * you to pass additional settings for the text-to-speech synthesis. It is of type
   * `Partial<TextToSpeechSetting>`, which means it can be a partial object of the
   * `TextToSpeechSetting` interface
   * @returns The `speak` function returns a Promise that resolves with the `textContent` that was
   * spoken.
   */
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

  /**
   * The `config` function in TypeScript merges the provided options with the existing
   * `TextToSpeechSetting` settings.
   * @param [opts] - The `opts` parameter in the `config` function is a partial object of type
   * `TextToSpeechSetting`. It is used to update the settings of the text-to-speech functionality by
   * merging its properties with the existing settings using `Object.assign`.
   */
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

