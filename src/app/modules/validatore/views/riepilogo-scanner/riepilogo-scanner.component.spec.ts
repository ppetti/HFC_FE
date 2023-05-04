import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoScannerComponent } from './riepilogo-scanner.component';

describe('RiepilogoScannerComponent', () => {
  let component: RiepilogoScannerComponent;
  let fixture: ComponentFixture<RiepilogoScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiepilogoScannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiepilogoScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
