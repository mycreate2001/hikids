import { Component, OnInit } from '@angular/core';
import { TextToSpeechService } from 'src/app/services/text-to-speech/text-to-speech.service';
import {  colors, datas, rand } from '../../lib/game-data';
import { Point } from 'src/app/lib/point.interface';
import { AlphabetData } from 'src/app/lib/interface';

@Component({
  selector: 'timchu',
  templateUrl: './tim-chu.page.html',
  styleUrls: ['./tim-chu.page.scss'],
})
export class TimChuPage implements OnInit {
  characters:AlphabetData[]=datas;//correct
  views:ViewData[]=rand(datas)
    .map((x,p)=>{
      // const p=Math.round(Math.random()*colors.length);
      return{...x,check:false,color:colors[p%colors.length]}
    });// display
  pos:number=0;
  isAvailable:boolean=true;
  points:Point[]=[];
  // ch:AlphabetData=this.characters[0];
  constructor(private tts:TextToSpeechService) {

  }

  ngOnInit() {
    this.tts.config({lang:'vi-VN'});
    this.tts.speak("Bắt đầu với chữ '"+this.characters[this.pos].s+"'")
  }


  //button handle
  check(data:ViewData){
    const correctData=this.characters[this.pos];
    // wrong
    if(data.n!==correctData.n){
      this.tts.speak("đây là chữ '"+data.s+"' . Con cần tìm chữ '"+correctData.s+"'");
      return;
    }
    // correct word
    this.pos++;data.check=true;
    let msg=`chính xác! đây là chữ '${data.s}'!`
    if(this.pos==this.characters.length) msg+="chúc mừng con đã hoàn thành cho chơi tìm chữ!"
    else msg+=`chữ tiếp theo là '${this.characters[this.pos].s}'`
    this.tts.speak(msg);
  }


  /////// background //////////

}

interface ViewData extends AlphabetData{
  check:boolean;
  color:string;
}



