import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioOperatoriInterniAttiviDialogComponent } from './dettaglio-operatori-interni-attivi-dialog.component';

describe('DettaglioOperatoriInterniAttiviDialogComponent', () => {
  let component: DettaglioOperatoriInterniAttiviDialogComponent;
  let fixture: ComponentFixture<DettaglioOperatoriInterniAttiviDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioOperatoriInterniAttiviDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioOperatoriInterniAttiviDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
