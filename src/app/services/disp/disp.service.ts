import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DispService {

  constructor(
    private modalCtr:ModalController,
    private alertCtr:AlertController
  ) { }

  async modal(component:any,props:any={}){
    props=JSON.parse(JSON.stringify(props));
    const modal=await this.modalCtr.create({
      component,
      componentProps:{...props,mode:'ios'}
    })
    modal.present();
    return modal.onDidDismiss();
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
