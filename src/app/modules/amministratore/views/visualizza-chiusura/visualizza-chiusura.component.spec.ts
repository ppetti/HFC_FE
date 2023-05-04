import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizzaChiusuraComponent } from './visualizza-chiusura.component';

describe('VisualizzaChiusuraComponent', () => {
  let component: VisualizzaChiusuraComponent;
  let fixture: ComponentFixture<VisualizzaChiusuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizzaChiusuraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizzaChiusuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
