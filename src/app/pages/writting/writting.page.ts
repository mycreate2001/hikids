import { Component, OnInit } from '@angular/core';
import { WrittingConfigPage, WrittingConfigPageInput, WrittingConfigPageOutput, WrittingConfigPageRole } from 'src/app/modals/writting-config/writting-config.page';
import { DispService } from 'src/app/services/disp/disp.service';
import { FptAiService } from 'src/app/services/fpt/fpt-ai.service';
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
  /** setting */
  settings:WrittingConfig=createSetting();      
  /** content of param */
  text:string=''                               
  /** all sentents need to speak */
  sentents:string[]=[];                        
  /** current need to read */
  sentent:string='';                            
  /** position of current sentent need to speak */
  pos:number=0;                                
  /** status of application */
  status:'start'|'pause'|'playing'='start';     
  /** interval speaking times */
  timeCount:number=0;                           
  /** speak times for each sentent */
  repeatCount:number=0;                        
  /** control interval function */
  private _intervalCtr:any;                    

  constructor(
    private disp:DispService,
    private fpt:FptAiService
  ) {}

  ngOnInit() {
    this._restore();
    this.prepareSentents();

  }


  //////////// BUTTONS //////////////

  /** button play & pause */
  toggle(){
    /** first times runing */
    if(this.status=='start'){
      this.status='playing';
      this.initial();
      this.runing();
      return;
    }

    /** resume play */
    if(this.status=='pause'){
      this.status='playing'
      this.runing();
      return;
    }

    /** resume */
    if(this.status=='playing'){
      this.status='pause';
      this.pause();
      return;
    }
    
  }

   /** change position when click other sentent */
  changePos(pos:number){
    if(pos===this.pos) return;// no action when click to current sentent
    this.pause();             // stop count
    //get new word
    this.pos=pos;
    this.prepareSentent();
    this.timeCount=this.settings.time;
    this.repeatCount=this.getRepeatCount();
    this.runing();
    this.speak();   //speaking for first times
  }

  /** handle setting button */
  setting(){
    const props:WrittingConfigPageInput={
      settings:this.settings,
      voices:this.fpt.getVoices()
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

  /** handle sentents was edited */
  updateSentents(){
    console.log("test-updateSentents")
    this.prepareSentents();
    this._backup();
    this.stop();
  }


  ////////// backuground /////////////

  /** initial for begining times */
  initial(){
    this.prepareSentents();                   // separate to each sentent */
    this.pos=0;                               // from begining */
    this._intervalCtr=null;                   // reset ctr
    this.prepareSentent();                    // get current sentent
    this.timeCount=this.settings.time;
    this.repeatCount=this.getRepeatCount();   // second
    this.speak();     // speaking for first times
  }


  /** update new sentent */
  prepareSentent(){
    let text=this.sentents[this.pos];
    _SPECIALS.forEach(sp=>{
      text=text.replace(sp.v,sp.n);
    })
    this.sentent=text;
  }

  /** get time(second) for each sentent */
  getRepeatCount():number{
    let wordsLength=this.sentent.split(" ").length;//words count
    const times=Math.ceil(length*this.settings.writeSpeed/this.settings.time)
    const result= Math.max(times,this.settings.repeat);
    return result;
  }

  /** text to speak currentword */
  speak(){
    this.fpt.speak(this.sentent);
  }

  /** finish speaking */
  stop(){
    this.pause();
    this.pos=0;
    this.status='start';
  }



 
  /** pause speaking */
  pause(){
    if(this._intervalCtr )clearInterval(this._intervalCtr);
  }

  /** update settings
   * It's just effect to next sentent or next speaking
   */
  updateSetting(){
    this._backup();
    this.fpt.config({voice:this.settings.voice,speed:this.settings.speed})
    this.runing();
  }


  runing(){
    //reset controller
    if(this._intervalCtr) clearInterval(this._intervalCtr);
    //set new interval
    this._intervalCtr=setInterval(()=>{
      if(--this.timeCount<=0){
        this.timeCount=this.settings.time;
        if(--this.repeatCount<=0){
          if(++this.pos>=this.sentents.length) return this.stop();
          this.prepareSentent();/** get next content */
          this.repeatCount=this.getRepeatCount();
          this.speak();
          return;
        }

        this.speak();/** speak current word */
      }
    },1000)
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

  /** prepare sentents (all) */
  prepareSentents(){
    const text:string=this.text.split(" ").filter(x=>!!x).join(" ");
    this.sentents=text.split("\n").filter(x=>!!x);
  }
  
}


export interface WrittingConfig{
  wordCount:number;   // work no for each time reading
  repeat:number;      // repeat times
  time:number;        // delay time for each reading
  speed:number;       // speed
  writeSpeed:number;
  voice:string;       // voiceID
}

function createSetting(opts:Partial<WrittingConfig>={}):WrittingConfig{
  const df:WrittingConfig={
    wordCount:2,
    repeat:3,
    time:15,
    speed:-1,
    writeSpeed:7,
    voice:'banmai'
  }
  return Object.assign(df,opts);
}

