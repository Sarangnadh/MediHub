import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmnetsComponent } from './appointmnets.component';

describe('AppointmnetsComponent', () => {
  let component: AppointmnetsComponent;
  let fixture: ComponentFixture<AppointmnetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmnetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmnetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
