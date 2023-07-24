import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoanTuPage } from './doan-tu.page';

describe('DoanTuPage', () => {
  let component: DoanTuPage;
  let fixture: ComponentFixture<DoanTuPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DoanTuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
