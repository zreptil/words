import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterMindComponent } from './letter-mind.component';

describe('LetterMindComponent', () => {
  let component: LetterMindComponent;
  let fixture: ComponentFixture<LetterMindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LetterMindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterMindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
