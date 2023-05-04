import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneMacrosettoriComponent } from './gestione-macrosettori.component';

describe('GestioneMacrosettoriComponent', () => {
  let component: GestioneMacrosettoriComponent;
  let fixture: ComponentFixture<GestioneMacrosettoriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestioneMacrosettoriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneMacrosettoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
