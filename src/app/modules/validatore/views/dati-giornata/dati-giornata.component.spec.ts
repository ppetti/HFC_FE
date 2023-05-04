import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiGiornataComponent } from './dati-giornata.component';

describe('DatiGiornataComponent', () => {
  let component: DatiGiornataComponent;
  let fixture: ComponentFixture<DatiGiornataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatiGiornataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiGiornataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
