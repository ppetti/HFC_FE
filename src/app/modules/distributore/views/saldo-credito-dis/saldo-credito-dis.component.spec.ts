import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoCreditoDisComponent } from './saldo-credito-dis.component';

describe('SaldoCreditoDisComponent', () => {
  let component: SaldoCreditoDisComponent;
  let fixture: ComponentFixture<SaldoCreditoDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldoCreditoDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoCreditoDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
