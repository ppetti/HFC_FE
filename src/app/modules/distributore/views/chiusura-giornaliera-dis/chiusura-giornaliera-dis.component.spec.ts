import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiusuraGiornalieraDisComponent } from './chiusura-giornaliera-dis.component';

describe('ChiusuraGiornalieraDisComponent', () => {
  let component: ChiusuraGiornalieraDisComponent;
  let fixture: ComponentFixture<ChiusuraGiornalieraDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiusuraGiornalieraDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiusuraGiornalieraDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
