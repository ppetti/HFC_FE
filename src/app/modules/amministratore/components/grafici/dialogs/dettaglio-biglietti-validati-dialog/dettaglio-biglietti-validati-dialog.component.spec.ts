import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioBigliettiValidatiDialogComponent } from './dettaglio-biglietti-validati-dialog.component';

describe('DettaglioBigliettiValidatiDialogComponent', () => {
  let component: DettaglioBigliettiValidatiDialogComponent;
  let fixture: ComponentFixture<DettaglioBigliettiValidatiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioBigliettiValidatiDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioBigliettiValidatiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
