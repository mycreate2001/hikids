import { Component, OnInit } from '@angular/core';
import { TextToSpeechService } from 'src/app/services/text-to-speech/text-to-speech.service';

@Component({
  selector: 'app-writting',
  templateUrl: './writting.page.html',
  styleUrls: ['./writting.page.scss'],
})
export class WrittingPage implements OnInit {
  setting:Setting=createSetting();  // setting
  text:string=''                    // text to read/write
  readStrs:string[]=[];
  pos:number=0;                     // reading position
  isPause:boolean=true;            // control play or pause
  time:number=0;
  repeatCount:number=0;
  private _intervalCtr:any=null;             // control interval repeat reading
  constructor(private tts:TextToSpeechService) { }

  ngOnInit() {
    this.tts.config({rate:0.4})
    // this.text='  chuyền trên cành cây.   Vì sao sói lúc nào cũng cảm thấy buồn bực. Viết vào vở câu trả lời cho câu hỏi c ở mục 3'
    this.prepareWord();
  }

  //////////// BUTTONS //////////////
  start(){
    this.isPause=!this.isPause
    console.log("isPause:",this.isPause);
    if(this.isPause) return this.pause();
    this.startTime();
  }

  pause(){
    if(this._intervalCtr) clearInterval(this._intervalCtr);
  }

  updateSetting(){
    this.stop();
    this.repeatCount=this.setting.repeat;
  }

  startTime(){
    this.speak();
    this.time=this.setting.wordCount*this.setting.time;
    this.repeatCount=this.setting.repeat;
    this._intervalCtr=setInterval(()=>{
      if(--this.time==0){
        this.time=this.setting.wordCount*this.setting.repeat;
        if(--this.repeatCount==0){
          this.repeatCount=this.setting.repeat;
          if(++this.pos==this.readStrs.length) return this.stop();
        }
        this.speak();
      }
    },1000)

  }

  speak(){
    const text:string=this.readStrs[this.pos];
    console.log("speak:",text);
    this.tts.speak(text);
  }

  stop(){
    this.pause();
    this.pos=0;
    this.repeatCount=this.setting.repeat;
  }

  

  ////////// backuground /////////////
  updateText(){
    this.prepareWord();
    this.stop();
  }

  prepareWord(){
    const specials= [{v:/\./g,n:" chấm."},{v:/\,/g,n:" phẩy,"}];
    let correctWord=this.text.split(" ").filter(x=>!!x);
    console.log({correctWord})
    const n=Math.ceil(correctWord.length/this.setting.wordCount);
    let words:string[]=[];
    let start:number=0;
    let end:number=0;
    let word:string=''
    for(let i=0;i<n;i++){
      start=i*this.setting.wordCount;
      end=start+this.setting.wordCount;
      word=correctWord.slice(start,end).join(" ")
      specials.forEach(sp=>{
        word=word.replace(sp.v,sp.n)
      })
      words.push(word);
    }
    console.log({words});
    this.readStrs=words;
  }


}

interface Setting{
  wordCount:number;   // work no for each time reading
  repeat:number;      // repeat times
  time:number;        // delay time for each reading
  speed:number;       // speed
}

function createSetting(opts:Partial<Setting>={}):Setting{
  const df:Setting={
    wordCount:2,
    repeat:3,
    time:15,
    speed:1
  }
  return Object.assign(df,opts);
}
