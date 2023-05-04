import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreazioneBigliettiBianchiComponent } from './creazione-biglietti-bianchi.component';

describe('CreazioneBigliettiBianchiComponent', () => {
  let component: CreazioneBigliettiBianchiComponent;
  let fixture: ComponentFixture<CreazioneBigliettiBianchiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreazioneBigliettiBianchiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreazioneBigliettiBianchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
