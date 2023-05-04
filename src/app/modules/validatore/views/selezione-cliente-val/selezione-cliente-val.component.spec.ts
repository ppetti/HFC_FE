import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezioneClienteValComponent } from './selezione-cliente-val.component';

describe('SelezioneClienteValComponent', () => {
  let component: SelezioneClienteValComponent;
  let fixture: ComponentFixture<SelezioneClienteValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelezioneClienteValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezioneClienteValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
