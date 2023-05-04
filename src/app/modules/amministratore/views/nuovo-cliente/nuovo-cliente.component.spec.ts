import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovoClienteComponent } from './nuovo-cliente.component';

describe('NuovoClienteComponent', () => {
  let component: NuovoClienteComponent;
  let fixture: ComponentFixture<NuovoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuovoClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuovoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
