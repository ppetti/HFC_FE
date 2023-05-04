import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizzaStoricoDatiTurniComponent } from './visualizza-storico-dati-turni.component';

describe('VisualizzaStoricoDatiTurniComponent', () => {
  let component: VisualizzaStoricoDatiTurniComponent;
  let fixture: ComponentFixture<VisualizzaStoricoDatiTurniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizzaStoricoDatiTurniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizzaStoricoDatiTurniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
