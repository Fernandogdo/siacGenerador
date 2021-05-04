import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPersonalizacionComponent } from './modal-personalizacion.component';

describe('ModalPersonalizacionComponent', () => {
  let component: ModalPersonalizacionComponent;
  let fixture: ComponentFixture<ModalPersonalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPersonalizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPersonalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
