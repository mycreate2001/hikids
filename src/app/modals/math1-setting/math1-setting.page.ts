import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MathSetting } from 'src/app/pages/math1/math1.page';
const _BACKUP_LIST=['settings']
@Component({
  selector: 'app-math1-setting',
  templateUrl: './math1-setting.page.html',
  styleUrls: ['./math1-setting.page.scss'],
})
export class Math1SettingPage implements OnInit {
  /** inputing */
  settings!:MathSetting
  /** INTERNAL VARIABLE */
  backupStrs:string[]=[];
  constructor(private __modal:ModalController) { }

  ngOnInit() {
    this.backupStrs=_BACKUP_LIST.map(key=>{
      const txt=JSON.stringify((this as any)[key]);
      const a=JSON.parse(txt); //backup value
      (this as any)[key]=a;
      return txt;
    })
  }

  /////// buttons ///////////
  done(role:Math1SettingPageRole='ok'):any{
    if(role!=='ok') return this.__modal.dismiss(null,role);
    const data:Math1SettingPageOutput={
      settings:this.settings
    }
    return this.__modal.dismiss(data,role);
  }

  ///////// BACKGROUNDS/////////
  isUpdate(){
    console.log("isUpdate");
    return !_BACKUP_LIST.every((key,pos)=>{
      const backup=this.backupStrs[pos];
      const current=JSON.stringify((this as any)[key])
      return backup===current
    })
  }
}

export type Math1SettingPageRole="ok"|"cancel"
export interface Math1SettingPageInput{
  settings:MathSetting
}



export interface Math1SettingPageOutput extends Math1SettingPageInput{

}
