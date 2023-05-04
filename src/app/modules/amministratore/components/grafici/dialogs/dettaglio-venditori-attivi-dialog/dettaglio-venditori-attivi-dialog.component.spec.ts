import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioVenditoriAttiviDialogComponent } from './dettaglio-venditori-attivi-dialog.component';

describe('DettaglioVenditoriAttiviDialogComponent', () => {
  let component: DettaglioVenditoriAttiviDialogComponent;
  let fixture: ComponentFixture<DettaglioVenditoriAttiviDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioVenditoriAttiviDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioVenditoriAttiviDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
