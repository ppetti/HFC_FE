import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoDisComponent } from './riepilogo-dis.component';

describe('RiepilogoDisComponent', () => {
  let component: RiepilogoDisComponent;
  let fixture: ComponentFixture<RiepilogoDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiepilogoDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiepilogoDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
