import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservableFormComponent } from './observable-form.component';

describe('ObservableFormComponent', () => {
  let component: ObservableFormComponent;
  let fixture: ComponentFixture<ObservableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservableFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
