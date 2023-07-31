import { Component, OnInit } from '@angular/core';
import { AlphabetData, colors, datas, pickup, rand } from 'src/app/lib/game-data';
import { Point } from 'src/app/lib/point.interface';
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
  constructor(private tts:TextToSpeechService) { }

  ngOnInit() {
    this.tts.config({lang:'vi-VN'});
    this.build();
    this.delay=Date.now();
    this.tts.speak("Đâu là chữ '"+this.cCha.s+"'")
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

  check(data:AlphabetData){
    const delay=(Date.now()-this.delay)/1000
    const correctData=this.characters[this.pos];

    //wrong
    if(correctData.n!==data.n){
      this.tts.speak(`Đây là chữ '${data.s}'. con cần tìm chữ '${correctData.s}'`);
      this.point.add(correctData.n,false,delay)
      this.build();
      return;
    }

    //correct
    let msg:string=`chính xác! đấy là chữ '${data.s}'`;
    this.pos++;
    if(this.pos==this.characters.length) msg+=". chò trơi kết thúc!"
    else{
      this.cCha=this.characters[this.pos];
      msg+=`.\nTiếp theo! Đâu là chữ '${this.cCha.s}'`
    }
    this.point.add(data.n,true,delay);
    this.tts.speak(msg);
    this.build();
  }


}
