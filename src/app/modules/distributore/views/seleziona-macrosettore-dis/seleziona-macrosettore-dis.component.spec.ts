import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezionaMacrosettoreDisComponent } from './seleziona-macrosettore-dis.component';

describe('SelezionaMacrosettoreDisComponent', () => {
  let component: SelezionaMacrosettoreDisComponent;
  let fixture: ComponentFixture<SelezionaMacrosettoreDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelezionaMacrosettoreDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezionaMacrosettoreDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
