import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiBigliettoValComponent } from './aggiungi-biglietto-val.component';

describe('AggiungiBigliettoValComponent', () => {
  let component: AggiungiBigliettoValComponent;
  let fixture: ComponentFixture<AggiungiBigliettoValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggiungiBigliettoValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggiungiBigliettoValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
