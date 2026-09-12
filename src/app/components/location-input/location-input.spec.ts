import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationInput } from './location-input';

describe('LocationInput', () => {
  let component: LocationInput;
  let fixture: ComponentFixture<LocationInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationInput],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
