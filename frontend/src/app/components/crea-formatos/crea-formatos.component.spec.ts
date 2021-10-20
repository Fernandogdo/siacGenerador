import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaFormatosComponent } from './crea-formatos.component';

describe('CreaFormatosComponent', () => {
  let component: CreaFormatosComponent;
  let fixture: ComponentFixture<CreaFormatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaFormatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreaFormatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
