import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioBigliettiVenditaDialogComponent } from './dettaglio-biglietti-vendita-dialog.component';

describe('DettaglioBigliettiVenditaDialogComponent', () => {
  let component: DettaglioBigliettiVenditaDialogComponent;
  let fixture: ComponentFixture<DettaglioBigliettiVenditaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioBigliettiVenditaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioBigliettiVenditaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
