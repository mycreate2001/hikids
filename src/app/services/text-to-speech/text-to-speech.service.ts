import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private setting:TextToSpeechSetting=createTextToSpeechSetting();
  private synth!:SpeechSynthesis;
  voices:Array<SpeechSynthesisVoice>=[];
  voice!:SpeechSynthesisVoice;
  isAvailable:boolean=true;
  
  public selectedVoice!:SpeechSynthesisUtterance;

  constructor() {
    this.init();
    console.log("/*** init of tts ***/\n",this);
  }

  private async init(){
    if('speechSynthesis' in window){
      this.synth=window.speechSynthesis;
      this.selectedVoice=new SpeechSynthesisUtterance();
      //get voices list
      this.voices=await this.getVoices();
      //voice
      this.config();
      
      // functions
      this.synth.onvoiceschanged=(ev)=>{
        console.log("change language ",ev);
      }
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
   * The function `grapVoice` takes a string parameter `voice` and returns the `SpeechSynthesisVoice`
   * object that matches the given voice name.
   * @param {string} voice - The `voice` parameter is a string that represents the name of the voice
   * you want to select from the available voices.
   * @returns the selected SpeechSynthesisVoice object that matches the provided voice name.
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
   * The function takes in parameters for text, voice, pitch, rate, and volume, sets the properties of
   * the SpeechSynthesisUtterance object, and then speaks out the selected text using the specified
   * voice and settings.
   * @param {string} selectedText - The text that you want to be spoken out loud.
   * @param {string} selectedVoice - The selectedVoice parameter is a string that represents the voice
   * to be used for speech synthesis. It can be the name of a specific voice or a language code.
   * @param {number} selectedPitch - The selectedPitch parameter determines the pitch or tone of the
   * voice when speaking. A higher value will result in a higher pitch, while a lower value will result
   * in a lower pitch. The default value is usually 1.
   * @param {number} selectedRate - The selectedRate parameter determines the rate at which the text is
   * spoken. It is a number that represents the speed of speech. A value of 1 is the normal rate, while
   * values less than 1 will slow down the speech and values greater than 1 will speed up the speech.
   * @param {number} selectedVolume - The selectedVolume parameter is a number that represents the
   * volume at which the text will be spoken. It can range from 0 to 1, where 0 is the lowest volume
   * (mute) and 1 is the highest volume.
   */
  async speak( textContent:string, opts?:Partial<TextToSpeechSetting>):Promise<string>{
    console.log("speak options: ",opts);
    return new Promise((resolve,reject)=>{
      //set property
      if(opts)  this.config(opts)
      this.selectedVoice.text=textContent;
      
      //event
      this.selectedVoice.onerror=(e)=>{
        console.log("\n### ERROR ### ",e);
        return reject(e);
      }

      this.selectedVoice.onend=(e)=>{
        return resolve(textContent);
      }

      //speak out
      // console.log("speech:",textContent);
      this.synth.speak(this.selectedVoice);
    })
  }

  config(opts?:Partial<TextToSpeechSetting>){
    Object.assign(this.setting,opts);
    this.selectedVoice.pitch=this.setting.pitch;
    this.selectedVoice.volume=this.setting.volume;
    this.selectedVoice.lang=this.setting.lang;
    this.selectedVoice.rate=this.setting.rate;
    if(this.setting.voice) this.voice=this.voices.find(v=>v.name===this.setting.voice)||this.voices[0]
    else this.voice=this.voices.find(v=>v.lang===this.setting.lang)||this.voices[0]
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

