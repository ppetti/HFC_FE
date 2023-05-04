import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CercaListinoComponent } from './cerca-listino.component';

describe('CercaListinoComponent', () => {
  let component: CercaListinoComponent;
  let fixture: ComponentFixture<CercaListinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CercaListinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CercaListinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
