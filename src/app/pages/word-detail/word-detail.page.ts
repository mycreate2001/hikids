import { Component, OnInit } from '@angular/core';
import { AlertButton, AlertInput, ModalController } from '@ionic/angular';
import { AlphabetData, Languages } from 'src/app/lib/interface';
import { DispService } from 'src/app/services/disp/disp.service';
// import { AlphabetData } from 'src/app/lib/game-data';

@Component({
  selector: 'app-word-detail',
  templateUrl: './word-detail.page.html',
  styleUrls: ['./word-detail.page.scss'],
})
export class WordDetailPage implements OnInit {
  word!:AlphabetData;
  languages=Languages;
  groups:string[]=[];
  ex:string=''
  constructor(
    private modalCtr:ModalController,
    private disp:DispService
  ) { }

  ngOnInit() {
    if(this.word.ex && this.word.ex.length){
      this.ex=this.word.ex||""
    }
  }

  done(role:WordDetailPageRole='ok'):any{
    if(role!=='ok') return this.modalCtr.dismiss(null, role);
    if(this.ex){
      this.word.ex=this.ex
    }
    const out:WordDetailPageOutput={
      word:this.word,
    }
    return this.modalCtr.dismiss(out,role)
  }


  addGroup(){
    const inputs:AlertInput[]=[{label:'Tên nhóm mới',type:'text',name:'group'}]
    const buttons:AlertButton[]=[{text:'OK',role:'ok'},{text:'Cancel',role:'cancel'}]
    this.disp.alert({header:'Nhóm mới',buttons,inputs})
    .then(rs=>{
      if(rs.role!=='ok') return;
      let group:string=rs.data.values['group'];
      const pos=this.groups.findIndex(x=>x===group);
      if(pos==-1) this.groups.push(group);
      else group=this.groups[pos];
      this.word.group=group;

    })

  }

}

export interface WordDetailPageInput{
  word:AlphabetData;
  groups:string[];
}

export interface WordDetailPageOutput{
  word:AlphabetData
}
export type WordDetailPageRole="ok"|"cancel"|'back'
