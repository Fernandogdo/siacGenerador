import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacvPersonalizadoComponent } from './creacv-personalizado.component';

describe('CreacvPersonalizadoComponent', () => {
  let component: CreacvPersonalizadoComponent;
  let fixture: ComponentFixture<CreacvPersonalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacvPersonalizadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacvPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
