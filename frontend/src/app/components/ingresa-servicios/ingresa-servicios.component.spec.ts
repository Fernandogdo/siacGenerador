import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresaServiciosComponent } from './ingresa-servicios.component';

describe('IngresaServiciosComponent', () => {
  let component: IngresaServiciosComponent;
  let fixture: ComponentFixture<IngresaServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresaServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresaServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
