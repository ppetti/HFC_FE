import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrezioneVenditeComponent } from './correzione-vendite.component';

describe('CorrezioneVenditeComponent', () => {
  let component: CorrezioneVenditeComponent;
  let fixture: ComponentFixture<CorrezioneVenditeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrezioneVenditeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrezioneVenditeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
