import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiBigliettoDisComponent } from './aggiungi-biglietto-dis.component';

describe('AggiungiBigliettoDisComponent', () => {
  let component: AggiungiBigliettoDisComponent;
  let fixture: ComponentFixture<AggiungiBigliettoDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggiungiBigliettoDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggiungiBigliettoDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
