import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  games:Game[]=[
    {name:'Tìm chữ',image:'abc.png',note:'giúp bé làm quen với bảng chữ cái',url:'game1'},
    {name:'Làm quen chữ cái',image:'abc.png',note:'giúp bé làm quen với bảng chữ cái',url:'game1'},
    {name:'Làm quen chữ cái',image:'abc.png',note:'giúp bé làm quen với bảng chữ cái',url:'game1'},
    {name:'Làm quen chữ cái',image:'abc.png',note:'giúp bé làm quen với bảng chữ cái',url:'game1'},
    {name:'Làm quen chữ cái',image:'abc.png',note:'giúp bé làm quen với bảng chữ cái',url:'game1'},
    {name:'Làm quen chữ cái',image:'abc.png',note:'giúp bé làm quen với bảng chữ cái',url:'game1'}
  ]
  constructor(private route:Router) { }

  ngOnInit() {
  }

  //button handle
  detail(game:Game){
    this.route.navigate(["/",game.url])
  }
}

export interface Game{
  name:string;
  image:string;
  note:string;
  url:string;
}
