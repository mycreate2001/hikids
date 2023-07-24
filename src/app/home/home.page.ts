import { Component, OnInit, ViewChild } from '@angular/core';
import { TextToSpeechService, TextToSpeechSetting, createTextToSpeechSetting } from '../services/text-to-speech/text-to-speech.service';
import { IonRange, IonTextarea } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  voices:SpeechSynthesisVoice[]=[];   // all voices
  textContent:string='';              // content of speech
  setting:TextToSpeechSetting=createTextToSpeechSetting({lang:'vi-VN'})

  constructor(private speech:TextToSpeechService) {
    // this.init();
  }

  async ngOnInit() {
    this.voices=await this.speech.getVoices();
    this.setting.voice=this.speech.voice.name;
    console.log("test-001",{voice:this.speech.voice, voices:this.voices})
  }

  play(){
    //check condition
    if(!this.textContent) return console.log("WARN! content is empty")
    // this.speech.speak(this.textContent, this.setting);
    this.speech.speak(this.textContent);
  }

}


