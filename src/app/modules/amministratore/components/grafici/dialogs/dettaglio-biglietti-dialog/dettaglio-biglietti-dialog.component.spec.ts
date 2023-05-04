import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioBigliettiDialogComponent } from './dettaglio-biglietti-dialog.component';

describe('DettaglioBigliettiDialogComponent', () => {
  let component: DettaglioBigliettiDialogComponent;
  let fixture: ComponentFixture<DettaglioBigliettiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioBigliettiDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioBigliettiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
