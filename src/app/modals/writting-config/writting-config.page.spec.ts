import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WrittingConfigPage } from './writting-config.page';

describe('WrittingConfigPage', () => {
  let component: WrittingConfigPage;
  let fixture: ComponentFixture<WrittingConfigPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WrittingConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
