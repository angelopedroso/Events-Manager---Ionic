import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizadoresPage } from './organizadores.page';

describe('OrganizadoresPage', () => {
  let component: OrganizadoresPage;
  let fixture: ComponentFixture<OrganizadoresPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(OrganizadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
