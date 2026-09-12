import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Calcular } from './calcular';

describe('Calcular', () => {
  let component: Calcular;
  let fixture: ComponentFixture<Calcular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calcular],
    }).compileComponents();

    fixture = TestBed.createComponent(Calcular);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
