import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewPageComponent } from './my-new-page.component';

describe('MyNewPageComponent', () => {
  let component: MyNewPageComponent;
  let fixture: ComponentFixture<MyNewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
