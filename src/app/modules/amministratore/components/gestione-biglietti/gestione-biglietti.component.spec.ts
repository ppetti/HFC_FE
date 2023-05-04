import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneBigliettiComponent } from './gestione-biglietti.component';

describe('GestioneBigliettiComponent', () => {
  let component: GestioneBigliettiComponent;
  let fixture: ComponentFixture<GestioneBigliettiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestioneBigliettiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneBigliettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
