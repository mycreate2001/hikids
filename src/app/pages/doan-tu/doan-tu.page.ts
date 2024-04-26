import { Component, OnInit } from '@angular/core';
import { AlertButton, AlertInput } from '@ionic/angular';
import { colors, datas, pickup, rand } from 'src/app/lib/game-data';
import { AlphabetData, SettingData, _DB_SETTING, _DB_SETTING_LANGUAGE, _DB_SETTING_WORDS, _DB_WORDS } from 'src/app/lib/interface';
import { getList, toArray } from 'src/app/lib/minitools';
import { Point } from 'src/app/lib/point.interface';
import { TaskManager } from 'src/app/lib/task';
import { DispService } from 'src/app/services/disp/disp.service';
import { LocalDatabaseService } from 'src/app/services/localdatabase/local-database.service';
import { SpeakService } from 'src/app/services/speak/speak.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech/text-to-speech.service';
const _NUMBER_OF_CHARACTER=3
interface AlphabetDataExt extends AlphabetData{
  color:string;
}
@Component({
  selector: 'app-doan-tu',
  templateUrl: './doan-tu.page.html',
  styleUrls: ['./doan-tu.page.scss'],
})
export class DoanTuPage implements OnInit {
  words:AlphabetData[]=[];
  characters:AlphabetData[]=[];
  views:AlphabetDataExt[]=[];
  pos:number=0;
  cCha:AlphabetData=this.characters[this.pos];
  point=new Point();
  delay!:number;
  lang:string='vi-VN';
  isAvailable:boolean=true;
  groups:string[]=[];
  constructor(
    private spk:SpeakService,
    private db:LocalDatabaseService,
    private disp:DispService
  ) { }

  async ngOnInit() {
    //database
    this.words=await this.db.search(_DB_WORDS);
    this.groups=getList(this.words,"group");
    /////
    this.build();
    this.delay=Date.now();
    await this.spk.speak(true,"Đâu là ",this.cCha);
  }

  filter(){
    const groups:string[]=getList(this.characters,"group");
    const inputs:AlertInput[]=groups.map(group=>{
       const data:AlertInput={type:'checkbox',label:group,value:group,checked:this.groups.includes(group)}
       return data;
    })
    const buttons:AlertButton[]=[{text:'OK',role:'ok'},{text:'cancel',role:'cancel'}]
    this.disp.alert({header:'Lựa chọn nhóm',inputs,buttons})
    .then(rs=>{
      if(rs.role!=='ok') return;
      this.groups=rs.data.values;
      this._refresh();
    })
  }

  private _refresh(){
    this.characters=this.words.filter(x=>this.groups.includes(x.group));
    this.views=this.characters.map((t,i)=>{
      const data:AlphabetDataExt={...t,color:colors[i%colors.length]};
      return data;
    })
  }

  build(){
    this.cCha=this.characters[this.pos];
    const _colors=pickup(colors,_NUMBER_OF_CHARACTER+1);
    this.views=[...pickup(this.characters,_NUMBER_OF_CHARACTER,this.pos),this.cCha]
      .map((x,i)=>{
        return {...x,color:_colors[i]}
      });
    this.views=rand(this.views);
    this.delay=Date.now();
  }

  async check(data:AlphabetData):Promise<any>{
    if(!this.isAvailable) return;
    this.isAvailable=false;
    const delay=(Date.now()-this.delay)/1000
    const correctData=this.characters[this.pos];

    //wrong
    if(correctData.n!==data.n){
      this.point.add(correctData.n,false,delay);
      await this.spk.speak('chưa chuẩn. Đây là ', data ,' con cần tìm ',correctData);
      this.build();
      this.isAvailable=true;
      return;
    }

    //correct
    await this.spk.speak("chính xác! đấy là",data);

    this.pos++;
    if(this.pos==this.characters.length) {
      this.isAvailable=true;
      return await this.spk.speak("chò trơi kết thúc!")
    }

    this.cCha=this.characters[this.pos];
    this.point.add(data.n,true,delay);
    await this.spk.speak(true,'Tiếp theo! Đâu là',this.cCha);
    this.build();
    this.isAvailable=true;
  }

  // async speak(...contents:(AlphabetData|string)[]){
  //   console.log("\n\n/*** debug speak **/ start: ",{contents})
  //   const task=new TaskManager();
  //   const that=this;
  //   contents.forEach((content,i)=>{
  //     const cb=()=>{
  //       return typeof content==='string'? this.testSpeak(content,this.lang): this.testSpeak(content.s,content.lang)
  //     }
  //     task.push(cb);
  //   })
  //   await task.runAll();
  //   console.log("/** debug speak /finish ***/\n\n")
  // }

  // async testSpeak(txt:string,lang:string):Promise<any>{
  //   console.log("initial",{txt,lang});
  //   if(lang!==this.lang){
  //     await this.spk.speak(txt,{lang});
  //     this.spk.config({lang:this.lang})
  //   }
  //   else await this.tts.speak(txt);
  // }

}
