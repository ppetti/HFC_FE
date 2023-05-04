import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioBigliettiVenditaReteComponent } from './dettaglio-biglietti-vendita-rete.component';

describe('DettaglioBigliettiVenditaReteComponent', () => {
  let component: DettaglioBigliettiVenditaReteComponent;
  let fixture: ComponentFixture<DettaglioBigliettiVenditaReteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioBigliettiVenditaReteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioBigliettiVenditaReteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
