import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilitaCartaceaDistributoriComponent } from './disponibilita-cartacea-distributori.component';

describe('DisponibilitaCartaceaDistributoriComponent', () => {
  let component: DisponibilitaCartaceaDistributoriComponent;
  let fixture: ComponentFixture<DisponibilitaCartaceaDistributoriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisponibilitaCartaceaDistributoriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisponibilitaCartaceaDistributoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
