import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordDetailPage } from './word-detail.page';

describe('WordDetailPage', () => {
  let component: WordDetailPage;
  let fixture: ComponentFixture<WordDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WordDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
