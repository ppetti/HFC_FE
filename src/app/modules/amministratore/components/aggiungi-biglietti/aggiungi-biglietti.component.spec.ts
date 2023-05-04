import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiBigliettiComponent } from './aggiungi-biglietti.component';

describe('AggiungiBigliettiComponent', () => {
  let component: AggiungiBigliettiComponent;
  let fixture: ComponentFixture<AggiungiBigliettiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggiungiBigliettiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggiungiBigliettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
