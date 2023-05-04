import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssegnazioneBigliettiBianchiComponent } from './assegnazione-biglietti-bianchi.component';

describe('AssegnazioneBigliettiBianchiComponent', () => {
  let component: AssegnazioneBigliettiBianchiComponent;
  let fixture: ComponentFixture<AssegnazioneBigliettiBianchiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssegnazioneBigliettiBianchiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssegnazioneBigliettiBianchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
