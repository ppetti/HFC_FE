import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrelloValComponent } from './carrello-val.component';

describe('CarrelloValComponent', () => {
  let component: CarrelloValComponent;
  let fixture: ComponentFixture<CarrelloValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrelloValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrelloValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
