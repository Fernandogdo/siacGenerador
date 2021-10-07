import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloqueResumidoComponent } from './bloque-resumido.component';

describe('BloqueResumidoComponent', () => {
  let component: BloqueResumidoComponent;
  let fixture: ComponentFixture<BloqueResumidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloqueResumidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloqueResumidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
