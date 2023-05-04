import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezioneClienteDisComponent } from './selezione-cliente-dis.component';

describe('SelezioneClienteDisComponent', () => {
  let component: SelezioneClienteDisComponent;
  let fixture: ComponentFixture<SelezioneClienteDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelezioneClienteDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezioneClienteDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
