import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DispService {

  constructor(
    private _modalCtr:ModalController,
    private alertCtr:AlertController
  ) { }

  async modal(component:any,props:any={}){
    props=JSON.parse(JSON.stringify(props));
    const _modal=await this._modalCtr.create({
      component,
      componentProps:{...props,mode:'ios'}
    })
    _modal.present();
    return _modal.onDidDismiss();
  }

  async alert(content:string|AlertOptions){
    const opt:AlertOptions=typeof content==='string'
        ?{message:content,header:"Message",buttons:['OK']}
        :content;
    const alert=await this.alertCtr.create(opt)
    alert.present();
    return alert.onDidDismiss();
  }
}
