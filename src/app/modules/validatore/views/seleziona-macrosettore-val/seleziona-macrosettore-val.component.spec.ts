import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezionaMacrosettoreValComponent } from './seleziona-macrosettore-val.component';

describe('SelezionaMacrosettoreValComponent', () => {
  let component: SelezionaMacrosettoreValComponent;
  let fixture: ComponentFixture<SelezionaMacrosettoreValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelezionaMacrosettoreValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezionaMacrosettoreValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
