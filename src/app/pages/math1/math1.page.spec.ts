import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Math1Page } from './math1.page';

describe('Math1Page', () => {
  let component: Math1Page;
  let fixture: ComponentFixture<Math1Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Math1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
