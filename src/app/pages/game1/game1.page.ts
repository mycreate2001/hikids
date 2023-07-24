import { Component, OnInit } from '@angular/core';
import { TextToSpeechService } from 'src/app/services/text-to-speech/text-to-speech.service';
import { AlphabetData, datas, rand } from './data';

@Component({
  selector: 'app-game1',
  templateUrl: './game1.page.html',
  styleUrls: ['./game1.page.scss'],
})
export class Game1Page implements OnInit {
  characters:AlphabetData[]=datas;//correct
  views:ViewData[]=rand(datas).map(x=>{return{...x,check:false}});// display
  pos:number=0;
  isAvailable:boolean=true;
  // ch:AlphabetData=this.characters[0];
  constructor(private tts:TextToSpeechService) { }

  ngOnInit() {
    this.tts.config({lang:'vi-VN'});
    this.tts.speak("Bắt đầu với chữ '"+this.characters[this.pos].s+"'")
  }


  //button handle
  check(data:ViewData){
    const correctData=this.characters[this.pos];
    console.log("test-001",{data,correctData})
    if(data.n===correctData.n){
      this.tts.speak("chính xác! đây là chữ '"+data.s+"'.\n Chữ tiếp theo là chữ '"+this.characters[this.pos+1].s+"'");
      data.check=true;
      this.pos++;
      return;
    }
    this.tts.speak("sai rồi! đây là chữ '"+data.s+"' .con cần tìm chữ '"+correctData.s+"'")
  }


  /////// background //////////

}

interface ViewData extends AlphabetData{
  check:boolean
}

