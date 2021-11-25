import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaFormatosComponent } from './descarga-formatos.component';

describe('DescargaFormatosComponent', () => {
  let component: DescargaFormatosComponent;
  let fixture: ComponentFixture<DescargaFormatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargaFormatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargaFormatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
