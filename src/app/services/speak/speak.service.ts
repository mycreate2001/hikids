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
    contents=typeof content!=='boolean'?[content,...contents]:contents;
    const isEx=typeof content==='boolean'?content:false;
    contents.forEach(ct=>{
      if(typeof ct==='string'){
        this.tts.speak(ct);
        return;
      }
      const msg:string=isEx?(ct.s+" "+ct.ex):ct.s;
      this.tts.speak(msg,{lang:ct.lang})
    })
  }
}
