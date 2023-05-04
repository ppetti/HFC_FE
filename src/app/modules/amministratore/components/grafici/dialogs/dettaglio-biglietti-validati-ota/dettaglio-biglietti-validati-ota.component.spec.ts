import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioBigliettiValidatiOtaComponent } from './dettaglio-biglietti-validati-ota.component';

describe('DettaglioBigliettiVendutiToursComponent', () => {
  let component: DettaglioBigliettiValidatiOtaComponent;
  let fixture: ComponentFixture<DettaglioBigliettiValidatiOtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioBigliettiValidatiOtaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioBigliettiValidatiOtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
