import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterListComponent } from './counter-list.component';

describe('CounterListComponent', () => {
  let component: CounterListComponent;
  let fixture: ComponentFixture<CounterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
