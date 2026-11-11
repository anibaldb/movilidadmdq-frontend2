import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Foros } from './foros';

describe('Foros', () => {
  let component: Foros;
  let fixture: ComponentFixture<Foros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foros],
    }).compileComponents();

    fixture = TestBed.createComponent(Foros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
