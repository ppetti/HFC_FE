import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiusuraGiornalieraValComponent } from './chiusura-giornaliera-val.component';

describe('ChiusuraGiornalieraValComponent', () => {
  let component: ChiusuraGiornalieraValComponent;
  let fixture: ComponentFixture<ChiusuraGiornalieraValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiusuraGiornalieraValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiusuraGiornalieraValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
