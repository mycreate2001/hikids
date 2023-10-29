import { Injectable } from '@angular/core';
import { TextToSpeechService } from '../text-to-speech/text-to-speech.service';
import { AlphabetData } from 'src/app/lib/interface';
import { TaskManager } from 'src/app/lib/task';

@Injectable({
  providedIn: 'root'
})
export class SpeakService {
  lang:string='vi-VN'
  constructor(private tts:TextToSpeechService) {
    this.config();
  }

  config(opts?:Partial<{lang:string}>){
    if(opts && opts.lang) this.lang=opts.lang;
    this.tts.config({lang:this.lang});
  }

  async speak(content:boolean|string|AlphabetData,...contents:(string|AlphabetData)[]):Promise<any>{
    const tasks=new TaskManager();
    contents=typeof content!=='boolean'?[content,...contents]:contents;
    const isEx=typeof content==='boolean'?content:false;
    contents.forEach(content=>{
      const cb=()=>{
          return typeof content==='string'?
          this._speak(content)
          :this._speak(isEx?content.s+"\n"+content.ex:content.s,content.lang)
      }
      tasks.push(cb);
      
    })
    return tasks.start();
    // contents.forEach(_content=>{
    //   if(typeof _content==='string') return this.tts.speak(_content);
      
    //   const msg:string=isEx?(_content.s+" "+_content.ex):_content.s
    //   if(_content.lang!==this.lang){
    //     this.tts.speak(msg,{lang:_content.lang});
    //     this.tts.config({lang:this.lang})
    //   }
    //   else this.tts.speak(msg);
    //   return;
    // })
  }

  private async _speak(txt:string,lang?:string){
    if(lang && this.lang!==lang){
      await this.tts.speak(txt,{lang})
      this.tts.config({lang:this.lang})
      return;
    }
    return this.tts.speak(txt);
  }
}
