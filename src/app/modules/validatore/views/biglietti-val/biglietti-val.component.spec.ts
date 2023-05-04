import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigliettiValComponent } from './biglietti-val.component';

describe('BigliettiValComponent', () => {
  let component: BigliettiValComponent;
  let fixture: ComponentFixture<BigliettiValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigliettiValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigliettiValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
