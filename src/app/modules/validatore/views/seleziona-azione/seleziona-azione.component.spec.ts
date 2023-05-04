import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezionaAzioneComponent } from './seleziona-azione.component';

describe('SelezionaAzioneComponent', () => {
  let component: SelezionaAzioneComponent;
  let fixture: ComponentFixture<SelezionaAzioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelezionaAzioneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezionaAzioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
