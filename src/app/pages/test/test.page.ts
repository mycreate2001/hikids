import { Component, OnInit } from '@angular/core';
import { FptAiService } from 'src/app/services/fpt/fpt-ai.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(private fpt:FptAiService) { }

  ngOnInit() {
    this.fpt.speak("Chào bạn Thanh");
  }

}
