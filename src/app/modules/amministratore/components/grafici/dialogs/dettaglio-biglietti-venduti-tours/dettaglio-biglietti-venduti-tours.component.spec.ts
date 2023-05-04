import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioBigliettiVendutiToursComponent } from './dettaglio-biglietti-venduti-tours.component';

describe('DettaglioBigliettiVendutiToursComponent', () => {
  let component: DettaglioBigliettiVendutiToursComponent;
  let fixture: ComponentFixture<DettaglioBigliettiVendutiToursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioBigliettiVendutiToursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioBigliettiVendutiToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
