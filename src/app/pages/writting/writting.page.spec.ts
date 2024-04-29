import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WrittingPage } from './writting.page';

describe('WrittingPage', () => {
  let component: WrittingPage;
  let fixture: ComponentFixture<WrittingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WrittingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
