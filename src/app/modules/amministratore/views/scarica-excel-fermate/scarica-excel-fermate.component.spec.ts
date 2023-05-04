import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaricaExcelFermateComponent } from './scarica-excel-fermate.component';

describe('ScaricaExcelFermateComponent', () => {
  let component: ScaricaExcelFermateComponent;
  let fixture: ComponentFixture<ScaricaExcelFermateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScaricaExcelFermateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaricaExcelFermateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
