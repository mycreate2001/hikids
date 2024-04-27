import { Component, OnInit } from '@angular/core';
import { AlertButton, AlertInput, AlertOptions } from '@ionic/angular';
import { Math1SettingPage, Math1SettingPageInput, Math1SettingPageOutput, Math1SettingPageRole } from 'src/app/modals/math1-setting/math1-setting.page';
import { DispService } from 'src/app/services/disp/disp.service';
const _DB_SETTING="math1_setting";
const _BACKUP_LIST=['qty','questionLength','allowMemory',
                    'allowZero','allowMinus','max']
interface View{
  before:string;
  after:string;
  correct:number;     // correct answer
  answer:string;      // reply
  checked:boolean;      // checked
}
@Component({
  selector: 'app-math1',
  templateUrl: './math1.page.html',
  styleUrls: ['./math1.page.scss'],
})
export class Math1Page implements OnInit {
  database:Calc[]=[];
  views:View[]=[];

  /** setting */
  settings:MathSetting={
    qty:3,
    questionLength:20,
    allowMemory:false,
    allowMinus:false,
    allowZero:false,
    max:99
  }            //so lon nhat
  constructor(private disp:DispService) { }

  ngOnInit() {
    this._restore();
    this.start();
  }

  /// buttons ///////////////
  start(){
    this.database=generate(this.settings.questionLength,{
      qty:this.settings.qty,
      max:this.settings.max,
      allowMemory:this.settings.allowMemory,
      allowMinus:this.settings.allowMinus,
      allowZero:this.settings.allowZero,
    })
    console.log(this.database);
    this.build();
  }

  makePoint(){
    // console.log(this.views);
    const corrects=this.views.filter(view=>{
      const answer:number=parseInt(view.answer);
      view.checked=answer!==view.correct;
      return answer==view.correct;

    });
    const points:number=Math.round(10*corrects.length/this.views.length);
    console.log({points,corrects:corrects.length,views:this.views.length})
    this.disp.alert(`Chúc mừng bạn được ${points} điểm!`);
  }

  setting(){
    const props:Math1SettingPageInput={
      settings:this.settings
    };
    console.log("test-006: ",props)
    this.disp.modal(Math1SettingPage,props)
    .then(result=>{
      const role=result.role as Math1SettingPageRole;
      if(role!=='ok') return;
      const {settings}=result.data as Math1SettingPageOutput;
      this.settings=settings;
      this._backup();
      this.start();
    })
  }

  ///////// backgrounds ///////////
  build(){
    this.views=this.database.map(db=>{
      const st:string[]=db.data.map((d,pos)=>{
        const x=(pos>0 && d>0)? ("+"+d):d+"";
        return x;
      });
      st.push("="+db.result);
      let before=st.slice(0,db.pos).join(" ");
      before+=['+','-'].includes(st[db.pos].charAt(0))?
      st[db.pos].charAt(0):""
      const after=st.slice(db.pos+1,st.length+1).join(" ");
      console.log("test ",{db,pos:db.pos,before,after,st})
      let correct:number=db.pos===db.data.length?db.result:db.data[db.pos];
      correct=Math.abs(correct);
      return {before,after,correct,answer:'',checked:false}
    })
  }

  private _backup(){
    const strs=JSON.stringify(this.settings)
    localStorage.setItem(_DB_SETTING,strs);
  }

  private _restore(){
    const strs=localStorage.getItem(_DB_SETTING);
    try{
      if(!strs) return;
      const data=JSON.parse(strs);
      this.settings=data;
    }
    catch(err){
      console.log("_restore error ",err);
    }
  }

}

function calResult(numbers:number[]):number{
  return numbers.reduce((acc,cur)=>acc+cur,0)
}

function rand(max:number,min:number=0):number{
  const n= Math.floor(Math.random()*Math.abs(max-min));
  return min+n;
}

function generate(length:number,opts:Partial<GenerateOpts>={}):Calc[]{
  const df:GenerateOpts={
    max:99,
    allowMemory:false,
    allowMinus:false,
    qty:2,
    allowZero:false
  }
  const _opts:GenerateOpts=Object.assign(df,opts);
  const {max,qty}=_opts;
  let isDone:boolean=false;
  const outs=[];
  let out:number[]=[];
  while(!isDone){
    out=createCalc(max,{qty});
    if(check(out,_opts)) outs.push({data:out,result:calResult(out),pos:rand(out.length,0)})
    if(outs.length>=length) isDone=true;
  }
  return outs;
}


function createCalc(max:number,opts:Partial<CreateCalcOpts>={}):number[]{
  const _opts:CreateCalcOpts=Object.assign({qty:2,min:0},opts);
  const outs:number[]=[];
  let tmp:number=0;
  for(let i=0;i<_opts.qty;i++){
    tmp=calResult(outs);
    outs.push(rand(max-tmp,-tmp));
  }
  return outs;
}

function check(numbers:number[],opts:Partial<CheckOpts>={}):boolean{
  const {max,allowMemory,allowMinus,allowZero}:CheckOpts=
      Object.assign({min:0,max:99,allowMemory:false,allowMinus:false,allowZero:false},opts)
  //1+2+4
  let result:number=0;
  let endingLast:number=0;
  return numbers.every((n:number)=>{
    if(n>max) return false;                 // over maximum value
    if(!allowZero && n==0) return false;    // Not allow zeror
    //result
    result=result+n;
    if(!allowMinus && result<0) return false; // not allow minus
    if(result>max) return false;              // maximum
    endingLast+=(n/Math.abs(n))*parseInt(getLastStr(n+""));
    if(!allowMemory && (endingLast>9 ||endingLast<0)) return false;  //memory
    //other case
    return true;
  })
}

interface CreateCalcOpts{
  qty:number;
  min:number;
}

interface CheckOpts{
  max:number;
  allowMemory:boolean;
  allowMinus:boolean;
  allowZero:boolean;    //allow in calc has zeror
}

interface GenerateOpts extends CheckOpts{
  qty:number;
}

function getLastStr(str:string):string{
  return str.substring(str.length-1)
}

interface Calc{
  data:number[];
  result:number;
  pos:number;
}

export interface MathSetting{
  qty:number;                 // qty of number for each question
  questionLength:number;      // number of question
  allowMemory:boolean;        // 
  allowZero:boolean;          // 
  allowMinus:boolean;         // 
  max:number;                 // 
}
