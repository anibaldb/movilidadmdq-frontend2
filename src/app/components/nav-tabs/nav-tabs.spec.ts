import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavTabs } from './nav-tabs';

describe('NavTabs', () => {
  let component: NavTabs;
  let fixture: ComponentFixture<NavTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(NavTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
