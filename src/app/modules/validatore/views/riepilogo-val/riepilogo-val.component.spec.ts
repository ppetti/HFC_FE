import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoValComponent } from './riepilogo-val.component';

describe('RiepilogoValComponent', () => {
  let component: RiepilogoValComponent;
  let fixture: ComponentFixture<RiepilogoValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiepilogoValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiepilogoValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
