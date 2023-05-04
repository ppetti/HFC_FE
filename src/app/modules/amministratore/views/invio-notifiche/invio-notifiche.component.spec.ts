import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioNotificheComponent } from './invio-notifiche.component';

describe('InvioNotificheComponent', () => {
  let component: InvioNotificheComponent;
  let fixture: ComponentFixture<InvioNotificheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvioNotificheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvioNotificheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
