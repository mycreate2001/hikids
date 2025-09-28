import { Component, OnInit } from '@angular/core';
import { AlertButton, AlertInput, AlertOptions } from '@ionic/angular';
import { Math1SettingPage, Math1SettingPageInput, Math1SettingPageOutput, Math1SettingPageRole } from 'src/app/modals/math1-setting/math1-setting.page';
import { DispService } from 'src/app/services/disp/disp.service';
const _DB_SETTING="math1_setting";
const _BACKUP_LIST=['qty','questionLength','allowMemory',
                    'allowZero','allowMinus','max']
interface View{
  before:string;      // phép tính trước ô trống
  after:string;       // phép tính sau ô trống
  correct:number;     // correct answer
  answer:string;      // answer from user
  checked:boolean;    // check answer from software
}
@Component({
  selector: 'app-math1',
  templateUrl: './math1.page.html',
  styleUrls: ['./math1.page.scss'],
})
export class Math1Page implements OnInit {
  database:Calc[]=[];       // store all maths
  views:View[]=[];
  /** internal */
  remainTime:number=0;
  _lastTime:number=0;
  private _timeOut:any=null;
  private _his:{time:number,point:number}[]=[]
  /** setting */
  settings =CreateMathSetting();
  constructor(private disp:DispService) { }

  ngOnInit() {
    this._restore();
    this.start();
  }

  /// buttons ///////////////
  start(){
    this._stopTime();
    this._his=[];
    this.database=generate(this.settings.questionLength,{
      qty:this.settings.qty,
      max:this.settings.max,
      allowMemory:this.settings.allowMemory,
      allowMinus:this.settings.allowMinus,
      allowZero:this.settings.allowZero,
      blankCellEveryWhere:this.settings.blankCellEveryWhere
    })
    this.build();
    this._startTime();
    this._lastTime=Date.now();
  }

  makePoint(){
    // console.log(this.views);
    const time=Math.round((Date.now()-this._lastTime)/1000);
    this._stopTime();
    const corrects=this.views.filter(view=>{
      const answer:number=parseInt(view.answer);
      view.checked=answer!==view.correct;
      return answer==view.correct;

    });
    const point:number=Math.round(10*corrects.length/this.views.length);
    // console.log({points,corrects:corrects.length,views:this.views.length})
    this._his.push({time,point})
    let his=this._his.map((x,i)=>`(${i+1}). ${x.point} điểm, ${x.time} giây`).join("<br>")
    const message:string=`<p>
      Chúc mừng bạn được <b>${point}</b> điểm!</p>
      <p>Thời gian làm <b>${time}</b> giây</p>

      <br>[<b>Lịch sử]</b><br>
      ${his}`
    this.disp.alert({header:'Chấm điểm',message,buttons:['OK'],cssClass:'tbl-point'});
  }

  setting(){
    const props:Math1SettingPageInput={
      settings:this.settings
    };
    // console.log("test-006: ",props)
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
  /**
   * The `build` function in TypeScript processes data from a database to generate views with before
   * and after values for each entry.
   */
  build(){
    this.views=this.database.map((db)=>{
      const st:string[]=db.data.map((d,pos)=>{
        const x=(pos>0 && d>0)? ("+"+d):d+"";
        return x;
      });
      st.push("="+db.result);
      let before=st.slice(0,db.pos).join(" ");
      // before+=['+'].includes(st[db.pos].charAt(0))?
      // st[db.pos].charAt(0):""
      if(db.pos===st.length-1) before+="="
      const after=st.slice(db.pos+1,st.length+1).join(" ");
      // console.log("test ",{db,pos:db.pos,before,after,st})
      let correct:number=db.pos===db.data.length?db.result:db.data[db.pos];
      correct=Math.abs(correct);
      return {before,after,correct,answer:'',checked:false}
    })
  }

  /** start count timer */
  private _startTime(){
    this.remainTime=this.settings.questionLength*this.settings.limitTime;
    this._timeOut=setInterval(()=>{
      if(--this.remainTime<=0) this.makePoint();
    },1000)
  }

  /** stop count timer */
  private _stopTime(){
    if(this._timeOut) clearInterval(this._timeOut)
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
      this.settings=Object.assign({},this.settings,data);
    }
    catch(err){
      console.log("_restore error ",err);
    }
  }

}

/**
 * The function `calResult` takes an array of numbers as input and returns the sum of all the numbers
 * in the array.
 * @param {number[]} numbers - An array of numbers that will be used to calculate the result by summing
 * them up.
 * @returns The function `calResult` is returning the sum of all numbers in the input array `numbers`.
 */
function calResult(numbers:number[]):number{
  return numbers.reduce((acc,cur)=>acc+cur,0)
}

/**
 * The function `rand` generates a random number within a specified range.
 * @param {number} max - The `max` parameter in the `rand` function represents the maximum value that
 * can be generated randomly.
 * @param {number} [min=0] - The `min` parameter in the `rand` function represents the minimum value
 * that you want the random number to be greater than or equal to. If no `min` value is provided when
 * calling the function, it defaults to 0.
 * @returns The function `rand` returns a random number between the `min` (defaulted to 0 if not
 * provided) and `max` values (exclusive).
 */
function rand(max:number,min:number=0):number{
  const n= Math.floor(Math.random()*Math.abs(max-min));
  return min+n;
}

/**
 * The function generates an array of calculations based on specified options until a certain length is
 * reached.
 * @param {number} length - The `length` parameter in the `generate` function specifies the number of
 * calculations to generate. It determines how many calculations will be included in the output array.
 * @param opts - The `opts` parameter in the `generate` function is an optional object that allows you
 * to customize the generation of calculations. It accepts the following properties:
 * @returns The `generate` function returns an array of objects, where each object contains the
 * following properties:
 * - `data`: an array of numbers representing a calculation
 * - `result`: the result of the calculation
 * - `pos`: a randomly generated number within the range of the calculation array
 */
function generate(length:number,opts:Partial<GenerateOpts>={}):Calc[]{
  const df:GenerateOpts={
    max:99,
    allowMemory:false,
    allowMinus:false,
    qty:2,
    allowZero:false,
    blankCellEveryWhere:false
  }
  const _opts:GenerateOpts=Object.assign(df,opts);
  console.log("initila ",_opts);
  const {max,qty}=_opts;
  let isDone:boolean=false;
  const outs=[];
  let out:number[]=[];
  while(!isDone){
    out=createCalc(max,{qty});
    if(check(out,_opts)){
      outs.push({data:out,result:calResult(out),pos:_opts.blankCellEveryWhere?rand(out.length,0):out.length});
    }
    if(outs.length>=length) isDone=true;
  }
  return outs;
}


/**
 * The function `createCalc` generates an array of random numbers based on specified options.
 * @param {number} max - The `max` parameter in the `createCalc` function represents the maximum value
 * that can be generated randomly. This value is used to limit the range of random numbers that can be
 * generated in the calculation.
 * @param opts - The `opts` parameter in the `createCalc` function is an optional object that allows
 * you to customize the behavior of the function. It has the following properties:
 * @returns The `createCalc` function returns an array of numbers.
 */
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
  blankCellEveryWhere:boolean
}

function getLastStr(str:string):string{
  return str.substring(str.length-1)
}

/** phep tinh */
interface Calc{
  data:number[];    // all numbers , example 1+2+3=6 => data=[1,2,3]
  result:number;    // result=6
  pos:number;       
}

export interface MathSetting{
  qty:number;                 // qty of number for each question
  questionLength:number;      // number of question
  allowMemory:boolean;        // 
  allowZero:boolean;          // 
  allowMinus:boolean;         // 
  max:number;                 // 
  limitTime:number;           // time for each Question [second]
  blankCellEveryWhere:boolean;
}

export function CreateMathSetting(opts:Partial<MathSetting>={}):MathSetting{
  const df:MathSetting={
    qty:2,
    questionLength:10,
    allowMemory:false,
    allowMinus:false,
    allowZero:false,
    max:99,
    limitTime:10,
    blankCellEveryWhere:false
  }
  return Object.assign(df,opts)
}


/**
 * 
 * phép tính + - * / ...
 * ví dụ phép tính 1+2-3+5*2=10 => lưu trong db [1,2,3,5,2,10]; dấu [+,-,+,*]
 * Cài đặt
 * - không có số âm. Kết quả phải > 0
 * - Không bao gồm số 0 trong tính toán, tất cả các 
 * - kết quả phải trong phạm vi cho phép 
 * - các phép tính: [cộng trừ, nhân chia,công trừ nhân chia]
 */


