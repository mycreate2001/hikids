import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WrittingConfig } from 'src/app/pages/writting/writting.page';
const _BACKUP_LIST=["settings"]
@Component({
  selector: 'app-writting-config',
  templateUrl: './writting-config.page.html',
  styleUrls: ['./writting-config.page.scss'],
})
export class WrittingConfigPage implements OnInit {
  /** input */
  settings!:WrittingConfig;
  /** internal */
  backupStr:string[]=[]
  constructor(private _modal:ModalController) { }

  ngOnInit() {
    this.settings=JSON.parse(JSON.stringify(this.settings))
    this.backupStr=_BACKUP_LIST.map(key=>{
      const data=(this as any)[key];
      return JSON.stringify(data)
    })
  }

  ///////// buttons //////////////
  done(role:WrittingConfigPageRole='ok'):any{
    if(role!=='ok') return this._modal.dismiss(null,role);
    const data:WrittingConfigPageOutput={
      settings:this.settings
    }
    this._modal.dismiss(data,role)
  }

  //backgrounds////
  isUpdate():boolean{
    return !_BACKUP_LIST.every((key,pos)=>{
      const current=JSON.stringify((this as any)[key]);
      const backup=this.backupStr[pos];
      return current==backup;
    })
  }

}

export type WrittingConfigPageRole="ok"|"cancel";
export interface WrittingConfigPageInput{
  settings:WrittingConfig
}

export interface WrittingConfigPageOutput extends WrittingConfigPageInput{

}
