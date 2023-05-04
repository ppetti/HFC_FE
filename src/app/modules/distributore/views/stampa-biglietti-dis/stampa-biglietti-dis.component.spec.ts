import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampaBigliettiDisComponent } from './stampa-biglietti-dis.component';

describe('StampaBigliettiDisComponent', () => {
  let component: StampaBigliettiDisComponent;
  let fixture: ComponentFixture<StampaBigliettiDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StampaBigliettiDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StampaBigliettiDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
