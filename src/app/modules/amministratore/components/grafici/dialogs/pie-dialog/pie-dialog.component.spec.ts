import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieDialogComponent } from './pie-dialog.component';

describe('PieDialogComponent', () => {
  let component: PieDialogComponent;
  let fixture: ComponentFixture<PieDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
