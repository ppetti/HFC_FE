import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampaBigliettiValComponent } from './stampa-biglietti-val.component';

describe('StampaBigliettiValComponent', () => {
  let component: StampaBigliettiValComponent;
  let fixture: ComponentFixture<StampaBigliettiValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StampaBigliettiValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StampaBigliettiValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
