import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioPasseggeriComponent } from './dettaglio-passeggeri.component';

describe('DettaglioPasseggeriComponent', () => {
  let component: DettaglioPasseggeriComponent;
  let fixture: ComponentFixture<DettaglioPasseggeriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettaglioPasseggeriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioPasseggeriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
