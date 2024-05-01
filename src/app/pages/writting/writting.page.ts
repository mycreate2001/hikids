import { Component, OnInit } from '@angular/core';
import { WrittingConfigPage, WrittingConfigPageInput, WrittingConfigPageOutput, WrittingConfigPageRole } from 'src/app/modals/writting-config/writting-config.page';
import { DispService } from 'src/app/services/disp/disp.service';
import { FptAiService } from 'src/app/services/fpt-ai/fpt-ai.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech/text-to-speech.service';
// import { setInterval } from 'timers';
const _BACKUP_LIST=["settings","text"];
const _DB_WRITING="writting_config"

const _SPECIALS= [
  {v:/\./g,n:" -- chấm. "},{v:/\,/g,n:" --phẩy, "},
  {v:/\?/g,n:" -- chấm hỏi? "},{v:/\:/g,n:" --hai chấm: "},
  {v:/\;/g,n:" -- chấm phẩy; "},
  // {v:/\n/g,n:" xuống dòng\n"},
  {v:/\!/g,n:" -- chấm than! "}
];

@Component({
  selector: 'app-writting',
  templateUrl: './writting.page.html',
  styleUrls: ['./writting.page.scss'],
})
export class WrittingPage implements OnInit {
  settings:WrittingConfig=createSetting();  // setting
  text:string=''                    // text to read/write
  readStrs:string[]=[];
  pos:number=0;                     // reading position
  isPause:boolean=true;            // control play or pause
  time:number=0;
  repeatCount:number=0;
  currentString:string=''
  player!:HTMLAudioElement;
  private _intervalCtr:any;             // control interval repeat reading
  constructor(private tts:TextToSpeechService,
    private disp:DispService,
    private fpt:FptAiService
  ) { const a=this.fpt.player('')}

  ngOnInit() {
    this._restore();
    this.tts.config({rate:this.settings.speed})
    // this.text='  chuyền trên cành cây.   Vì sao sói lúc nào cũng cảm thấy buồn bực. Viết vào vở câu trả lời cho câu hỏi c ở mục 3'
    this.prepareWord();
    this.tts.getVoices().then(voices=>console.log(voices))
  }


  //////////// BUTTONS //////////////
  toggle(){
    this.isPause=!this.isPause
    if(this.isPause) return this.pause();
    this.startTime();
  }

  changePos(pos:number){
    this.pause();
    this.pos=pos;
    this.startTime();
    // this.startTime();

  }

  pause(){
    clearInterval(this._intervalCtr);
  }

  updateSetting(){
    this._backup();
    this.tts.config({rate:this.settings.speed});
    this.pause(); //clear interval;
    this.startTime();
  }

  setting(){
    const props:WrittingConfigPageInput={
      settings:this.settings
    }
    this.disp.modal(WrittingConfigPage,props)
    .then(result=>{
      const role=result.role as WrittingConfigPageRole;
      if(role!=='ok') return;
      const {settings}=result.data as WrittingConfigPageOutput
      this.settings=settings;
      this.updateSetting();
    })
  }

  makeVoice(cb:Function|null=null){
    console.log("test-makeVoice");
    this.fpt.tts(this.currentString).subscribe(res=>{
      this.player=this.fpt.player(res.async);
      this.player.play();
      if(cb) cb()
    })
  }

  /** next sentent */
  getNext(){
    console.log("test-getNext");
    let text=this.readStrs[this.pos];
    _SPECIALS.forEach(sp=>{
      text=text.replace(sp.v,sp.n);
    })
    this.currentString=text;
    this.makeVoice();
  }

  startTime(){
    this.getNext();
    this.time=this.settings.time;

    this._intervalCtr=setInterval(()=>{
      if(--this.time<=0){
        this.time=this.settings.time;
        if(--this.repeatCount<=0){
          if(++this.pos==this.readStrs.length) return this.stop();
          this.getNext();
          this.repeatCount=this.getTimeCount();
        }
        else this.speak();
      }
    },1000)

  }

  getTimeCount():number{
    let length=this.readStrs[this.pos].split(" ").length;
    length=Math.round(length*this.settings.writeSpeed/this.settings.time)
    const result= Math.max(length,this.settings.repeat);
    return result;
  }

  speak(){
    // console.log("speak:",this.currentString);
    // this.tts.speak(this.currentString);
    console.log("test-speak");
    if(this.player) this.player.play();
  }

  stop(){
    this.pause();
    this.pos=0;
    this.repeatCount=this.settings.repeat;
  }

  

  ////////// backuground /////////////
  updateText(){
    this.prepareWord();
    this.stop();
    this._backup();
  }

  private _restore(){
    try{
      const str=localStorage.getItem(_DB_WRITING);
      if(!str) return;
      const data=JSON.parse(str);
      Object.keys(data).forEach(key=>{
        const oldVal=(this as any)[key];
        const bkpVal=data[key];
        (this as any)[key]=Object.assign({},oldVal,bkpVal)
      })
      Object.assign(this,data);
    }
    catch(err){
      console.log("\nERROR: ",err);
    }
  }

  private _backup(){
    const data:any={}
    _BACKUP_LIST.forEach(key=>{
        const val=(this as any)[key];
        data[key]=val;
    })
    localStorage.setItem(_DB_WRITING,JSON.stringify(data))
  }

  prepareWord(){
   
    //filter space
    const text:string=this.text.split(" ").filter(x=>!!x).join(" ");
    this.readStrs=text.split("\n").filter(x=>!!x);
  }
  
}


export interface WrittingConfig{
  wordCount:number;   // work no for each time reading
  repeat:number;      // repeat times
  time:number;        // delay time for each reading
  speed:number;       // speed
  writeSpeed:number;
}

function createSetting(opts:Partial<WrittingConfig>={}):WrittingConfig{
  const df:WrittingConfig={
    wordCount:2,
    repeat:3,
    time:15,
    speed:0.4,
    writeSpeed:7
  }
  return Object.assign(df,opts);
}

