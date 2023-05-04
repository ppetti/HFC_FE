import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListiniPrezzoComponent } from './listini-prezzo.component';

describe('ListiniPrezzoComponent', () => {
  let component: ListiniPrezzoComponent;
  let fixture: ComponentFixture<ListiniPrezzoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListiniPrezzoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListiniPrezzoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
