import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrelloDisComponent } from './carrello-dis.component';

describe('CarrelloDisComponent', () => {
  let component: CarrelloDisComponent;
  let fixture: ComponentFixture<CarrelloDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrelloDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrelloDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
