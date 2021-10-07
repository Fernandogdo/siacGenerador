import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumidoCvComponent } from './resumido-cv.component';

describe('ResumidoCvComponent', () => {
  let component: ResumidoCvComponent;
  let fixture: ComponentFixture<ResumidoCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumidoCvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumidoCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
