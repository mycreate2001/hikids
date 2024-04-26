import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Math1SettingPage } from './math1-setting.page';

describe('Math1SettingPage', () => {
  let component: Math1SettingPage;
  let fixture: ComponentFixture<Math1SettingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Math1SettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
