import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipologiaBigliettoComponent } from './tipologia-biglietto.component';

describe('TipologiaBigliettoComponent', () => {
  let component: TipologiaBigliettoComponent;
  let fixture: ComponentFixture<TipologiaBigliettoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipologiaBigliettoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipologiaBigliettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
