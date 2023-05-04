import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaChartDialogComponent } from './area-chart-dialog.component';

describe('AreaChartDialogComponent', () => {
  let component: AreaChartDialogComponent;
  let fixture: ComponentFixture<AreaChartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaChartDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
