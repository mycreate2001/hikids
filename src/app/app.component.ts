import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  pages=[
    {name:'Tìm chữ',image:'abc.png',note:'giúp bé làm quen với bảng chữ cái',url:'tim-chu'},
    {name:'Đoán từ',image:'abc.png',note:'Giúp bé đoán chữ cái',url:'doan-tu'},
    {name:'Toán 1',image:'math.jpg',note:'bé làm toán',url:'math1'},
    {name:'Tập viết',image:'writing1.jpg',note:'Giúp bé luyện đánh vần và viết chữ',url:'writting'},
    {name:'Cài đặt',image:'abc.png',note:'cài đặt dữ liệu',url:'setting'}
  ]
  constructor() {}
}
