import { Component, OnInit } from '@angular/core';
import { TextToSpeechService } from 'src/app/services/text-to-speech/text-to-speech.service';
import {  colors, datas, rand } from '../../lib/game-data';
import { Point } from 'src/app/lib/point.interface';
import { AlphabetData, _DB_WORDS } from 'src/app/lib/interface';
import { SpeakService } from 'src/app/services/speak/speak.service';
import { LocalDatabaseService } from 'src/app/services/localdatabase/local-database.service';
import { getList } from 'src/app/lib/minitools';
import { DispService } from 'src/app/services/disp/disp.service';
import { AlertButton, AlertInput } from '@ionic/angular';

@Component({
  selector: 'timchu',
  templateUrl: './tim-chu.page.html',
  styleUrls: ['./tim-chu.page.scss'],
})
export class TimChuPage implements OnInit {
  words:AlphabetData[]=[];
  characters:AlphabetData[]=datas;//correct
  views:ViewData[]=[];            // display
  pos:number=0;
  isAvailable:boolean=true;     //enable button
  points:Point[]=[];
  groups:string[]=[];
  // ch:AlphabetData=this.characters[0];
  constructor(
    private spk:SpeakService,
    private db:LocalDatabaseService,
    private disp:DispService
    ) {}

  async ngOnInit() {
    // this.spk.config({lang:'vi-VN'});
    this.words=await this.db.search(_DB_WORDS);
    this.characters=this.words;
    this.groups=getList(this.characters,"group");
    this._build();
    this.spk.speak("Bắt đầu với '",this.characters[this.pos]);
  }

  private _build(){
    this.characters=this.characters.filter(x=>this.groups.includes(x.group));
    this.views=rand(this.characters).map((x,p)=>{
      return {...x,check:false,color:colors[p%colors.length]}
    })
  }


  //button handle
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
      this._build();
    })
  }


  check(data:ViewData){
    if(!this.isAvailable) return console.log(" ** WARN *** btn is not available now");
    this.isAvailable=false;
    const correctData=this.characters[this.pos];
    // wrong
    if(data.n!==correctData.n){
      this.spk.speak("đây là ",data,'Con cần tìm ',correctData);
      this.isAvailable=true;
      return;
    }
    // correct word
    this.pos++;data.check=true;
    this.spk.speak("chính xác! đây là ",data.s);
    if(this.pos==this.characters.length) {
      this.spk.speak("chúc mừng con đã hoàn thành cho chơi tìm chữ!");
      this.isAvailable=true;
      return;
    }
    this.spk.speak("tiếp theo là",this.characters[this.pos]);
    this.isAvailable=true;
  }


  /////// background //////////

}

interface ViewData extends AlphabetData{
  check:boolean;
  color:string;
}



