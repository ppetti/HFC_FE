import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigliettiDisComponent } from './biglietti-dis.component';

describe('BigliettiDisComponent', () => {
  let component: BigliettiDisComponent;
  let fixture: ComponentFixture<BigliettiDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigliettiDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigliettiDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
