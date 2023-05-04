import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneraListinoComponent } from './genera-listino.component';

describe('GeneraListinoComponent', () => {
  let component: GeneraListinoComponent;
  let fixture: ComponentFixture<GeneraListinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneraListinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneraListinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
