import { Component, OnInit } from '@angular/core';
// import { AlphabetData } from 'src/app/lib/game-data';
import { DispService } from 'src/app/services/disp/disp.service';
import { WordDetailPage, WordDetailPageInput, WordDetailPageOutput, WordDetailPageRole } from '../word-detail/word-detail.page';
import { LocalDatabaseService } from 'src/app/services/localdatabase/local-database.service';
import { AlphabetData, DatabaseType, GroupOfData, Languages, SettingData, _DB_SETTING, _DB_SETTING_LANGUAGE, _DB_SETTING_WORDS, _DB_WORDS, createAlphabetData } from 'src/app/lib/interface';
import { makeGroup } from 'src/app/lib/minitools';
import { AlertButton } from '@ionic/angular';

/// constant
const _BACKUP_LIST="language,words".split(",")

// main
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  languages=Languages;
  language:string=this.languages[0].value;
  wordGroups:GroupOfData<AlphabetData[]>[]=[];
  words:AlphabetData[]=[];                      //database of word
  backupStrs:DatabaseType<string>={}
  constructor(
    private disp:DispService,
    private db:LocalDatabaseService
  ) { }

  async ngOnInit() {
    this.words=await this.db.search(_DB_WORDS)||[]
    //build data
    this._build();
    console.log("initial ",this)
    //complete data --> backup
    this._getBackup();

  }


  // addWord(event:any,group:string){
  //   const word:AlphabetData=createAlphabetData({group})
  //   this.detail(event,group,word)
  // }

  // delWord(event:any,word:AlphabetData){

  // }
  async detail(event:any,data:DetailHandlerData){
    if(event) event.stopPropagation();//StopPropagetion
    //delete
    if(data.type=='delete'){
      const buttons:AlertButton[]=[
        {text:'delete',role:'delete',handler:()=>{
          const word=data.word;
          this.db.del(_DB_WORDS,word.id)
          .then(()=>{
            const pos:number=this.words.findIndex(x=>x.id===word.id)
            if(pos!==-1) this.words.splice(pos,1)
            this._build();
          })

        }},
        {text:'cancel'}
      ]
      await this.disp.alert({header:'Confirm delete',message:'Bạn có chắc chắn muốn xóa?',buttons})
      console.log("delete",this);
      return;
    }

    //edit or new
    const props:WordDetailPageInput={
      word:data.type==='edit'?data.word:createAlphabetData({group:data.group}),
      groups:this.wordGroups.map(gr=>gr.group)
    }
    console.log("props:",props);
    this.disp.modal(WordDetailPage,props)
    .then(rs=>{
      const role=rs.role as WordDetailPageRole;
      if(role!=='ok') return;
      const _data =rs.data as WordDetailPageOutput;
      const newWord=_data.word;
      console.log("test point-001:",{newWord});
      const pos:number=this.words.findIndex(x=>x.id===newWord.id);
      if(pos==-1) this.words.push(newWord);
      else this.words[pos]=newWord;
      console.log("test point-002:",{pos});
      //update view & database
      this._build();
      this.db.add(_DB_WORDS,newWord);
      console.log("test point-003:",this);
    })
  }

  save(){
    this.db.add(_DB_SETTING,{id:_DB_SETTING_LANGUAGE,data:this.language});
    this.db.add(_DB_SETTING,{id:_DB_SETTING_WORDS,data:this.words},true)
    //backup
    this._getBackup();
  }


  ///// BACKGROUND //////////////
  private _build(){
    console.log("test_build/ before ",this);
    this.wordGroups=makeGroup(this.words,"group");
    console.log("test_build/ after ",this);
  }

  isChange():boolean{
    const result= _BACKUP_LIST.every(key=>{
      const current=JSON.stringify((this as any)[key])
      const backup=this.backupStrs[key]
      return current===backup?true:false
    })
    return !result
  }

  private _getBackup(){
    _BACKUP_LIST.map(key=>{
      const str=JSON.stringify((this as any)[key])
      this.backupStrs[key]=str;
    })
  }

}


type DetailHandlerData={type:'add',group:string}|{type:'delete',word:AlphabetData}|{type:'edit',word:AlphabetData}
