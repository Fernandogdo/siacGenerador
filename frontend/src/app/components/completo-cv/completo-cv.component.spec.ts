import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletoCvComponent } from './completo-cv.component';

describe('CompletoCvComponent', () => {
  let component: CompletoCvComponent;
  let fixture: ComponentFixture<CompletoCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletoCvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletoCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
