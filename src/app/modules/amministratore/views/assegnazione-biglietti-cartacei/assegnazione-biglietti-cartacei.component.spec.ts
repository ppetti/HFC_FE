import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssegnazioneBigliettiCartaceiComponent } from './assegnazione-biglietti-cartacei.component';

describe('AssegnazioneBigliettiCartaceiComponent', () => {
  let component: AssegnazioneBigliettiCartaceiComponent;
  let fixture: ComponentFixture<AssegnazioneBigliettiCartaceiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssegnazioneBigliettiCartaceiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssegnazioneBigliettiCartaceiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
