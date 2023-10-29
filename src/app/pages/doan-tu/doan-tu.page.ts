import { Component, OnInit } from '@angular/core';
import { colors, datas, pickup, rand } from 'src/app/lib/game-data';
import { AlphabetData, SettingData, _DB_SETTING, _DB_SETTING_LANGUAGE, _DB_SETTING_WORDS, _DB_WORDS } from 'src/app/lib/interface';
import { toArray } from 'src/app/lib/minitools';
import { Point } from 'src/app/lib/point.interface';
import { TaskManager } from 'src/app/lib/task';
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
  characters:AlphabetData[]=datas;
  views:AlphabetDataExt[]=[];
  pos:number=0;
  cCha:AlphabetData=this.characters[this.pos];
  point=new Point();
  delay!:number;
  lang:string='vi-VN';
  isAvailable:boolean=true;
  constructor(
    private spk:SpeakService,
    private db:LocalDatabaseService
  ) { }

  async ngOnInit() {
    //database
    this.characters=await this.db.search(_DB_WORDS);

    /////
    // this.tts.config({lang:this.lang});
    this.spk.config({lang:this.lang})
    this.build();
    this.delay=Date.now();
    // await this.tts.speak("gì vậy ta");
    await this.spk.speak(true,"Đâu là ",this.cCha);
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
