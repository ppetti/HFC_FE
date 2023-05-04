import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrazioneBigliettiBianchiVendutiComponent } from './registrazione-biglietti-bianchi-venduti.component';

describe('RegistrazioneBigliettiBianchiVendutiComponent', () => {
  let component: RegistrazioneBigliettiBianchiVendutiComponent;
  let fixture: ComponentFixture<RegistrazioneBigliettiBianchiVendutiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrazioneBigliettiBianchiVendutiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrazioneBigliettiBianchiVendutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
