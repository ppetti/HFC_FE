import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreazioneBigliettiCartaceiComponent } from './creazione-biglietti-cartacei.component';

describe('CreazioneBigliettiCartaceiComponent', () => {
  let component: CreazioneBigliettiCartaceiComponent;
  let fixture: ComponentFixture<CreazioneBigliettiCartaceiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreazioneBigliettiCartaceiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreazioneBigliettiCartaceiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
