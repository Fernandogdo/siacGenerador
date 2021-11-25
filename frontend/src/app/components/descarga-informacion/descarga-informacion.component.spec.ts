import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaInformacionComponent } from './descarga-informacion.component';

describe('DescargaInformacionComponent', () => {
  let component: DescargaInformacionComponent;
  let fixture: ComponentFixture<DescargaInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargaInformacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargaInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
