import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovoUtenteComponent } from './nuovo-utente.component';

describe('NuovoUtenteComponent', () => {
  let component: NuovoUtenteComponent;
  let fixture: ComponentFixture<NuovoUtenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuovoUtenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuovoUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
