import { Component, OnInit } from '@angular/core';
import { TextToSpeechService } from 'src/app/services/text-to-speech/text-to-speech.service';
import {  colors, datas, rand } from '../../lib/game-data';
import { Point } from 'src/app/lib/point.interface';
import { AlphabetData } from 'src/app/lib/interface';
import { SpeakService } from 'src/app/services/speak/speak.service';

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
  isAvailable:boolean=true;     //enable button
  points:Point[]=[];
  // ch:AlphabetData=this.characters[0];
  constructor(
    private spk:SpeakService
    ) {}

  ngOnInit() {
    this.spk.config({lang:'vi-VN'});
    this.spk.speak("Bắt đầu với chữ '",this.characters[this.pos])
  }


  //button handle
  check(data:ViewData){
    if(!this.isAvailable) return console.log(" ** WARN *** btn is not available now");
    this.isAvailable=false;
    const correctData=this.characters[this.pos];
    // wrong
    if(data.n!==correctData.n){
      this.spk.speak("đây là chữ ",data,'Con cần tìm chữ ',correctData);
      this.isAvailable=true;
      return;
    }
    // correct word
    this.pos++;data.check=true;
    this.spk.speak("chính xác! đây là chữ ",data.s);
    if(this.pos==this.characters.length) {
      this.spk.speak("chúc mừng con đã hoàn thành cho chơi tìm chữ!");
      this.isAvailable=true;
      return;
    }
    this.spk.speak("chữ tiếp theo là",this.characters[this.pos]);
    this.isAvailable=true;
  }


  /////// background //////////

}

interface ViewData extends AlphabetData{
  check:boolean;
  color:string;
}



