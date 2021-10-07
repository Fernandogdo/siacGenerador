import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaPersonalizadoComponent } from './edita-personalizado.component';

describe('EditaPersonalizadoComponent', () => {
  let component: EditaPersonalizadoComponent;
  let fixture: ComponentFixture<EditaPersonalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditaPersonalizadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditaPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
