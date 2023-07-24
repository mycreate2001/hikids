import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Game1Page } from './game1.page';

describe('Game1Page', () => {
  let component: Game1Page;
  let fixture: ComponentFixture<Game1Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Game1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
