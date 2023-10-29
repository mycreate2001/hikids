import { Component, OnInit } from '@angular/core';
import { colors, datas, pickup, rand } from 'src/app/lib/game-data';
import { AlphabetData, SettingData, _DB_SETTING, _DB_SETTING_LANGUAGE, _DB_SETTING_WORDS, _DB_WORDS } from 'src/app/lib/interface';
import { toArray } from 'src/app/lib/minitools';
import { Point } from 'src/app/lib/point.interface';
import { TaskManager } from 'src/app/lib/task';
import { LocalDatabaseService } from 'src/app/services/localdatabase/local-database.service';
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
  constructor(
    private tts:TextToSpeechService,
    private db:LocalDatabaseService
  ) { }

  async ngOnInit() {
    //database
    this.characters=await this.db.search(_DB_WORDS);

    /////
    this.tts.config({lang:this.lang});
    this.build();
    this.delay=Date.now();
    await this.speak("Đâu là ",this.cCha);
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
    const delay=(Date.now()-this.delay)/1000
    const correctData=this.characters[this.pos];

    //wrong
    if(correctData.n!==data.n){
      this.point.add(correctData.n,false,delay)
      await this.speak('chưa chuẩn. Đây là ', data ,' con cần tìm ',correctData);
      this.build();
      return;
    }

    //correct
    await this.speak("chính xác! đấy là ",data);

    this.pos++;
    if(this.pos==this.characters.length) return await this.speak("chò trơi kết thúc!")

    this.cCha=this.characters[this.pos];
    await this.speak('Tiếp theo! Đâu là',this.cCha);
    this.point.add(data.n,true,delay);
    this.build();
  }

  async speak(...contents:(AlphabetData|string)[]){
    console.log("/*** debug speak **/ input: ",{contents})
    const task=new TaskManager();
    contents.forEach((content,i)=>{
      if(typeof content==='string'){
        const run=async ()=>{
          console.log(`tast ${i}:${content}`)
          await this.tts.speak(content,{lang:this.lang})
        }
        task.push(run);
        return;
      }
      const run=async ()=>{
        console.log(`tast ${i}:${content.s}`)
        await this.tts.speak(content.s,{lang:content.lang})
      }
      task.push(run);
    })
    await task.run();
    console.log("/** finish */")
  }



}
