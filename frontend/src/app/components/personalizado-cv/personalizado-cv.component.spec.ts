import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizadoCvComponent } from './personalizado-cv.component';

describe('PersonalizadoCvComponent', () => {
  let component: PersonalizadoCvComponent;
  let fixture: ComponentFixture<PersonalizadoCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalizadoCvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizadoCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
