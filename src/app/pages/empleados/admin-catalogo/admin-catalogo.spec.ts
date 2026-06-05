import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogo } from './admin-catalogo';

describe('AdminCatalogo', () => {
  let component: AdminCatalogo;
  let fixture: ComponentFixture<AdminCatalogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogo],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCatalogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
