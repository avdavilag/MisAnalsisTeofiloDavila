import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdenCompletaTurnosPage } from './orden-completa-turnos.page';

describe('OrdenCompletaTurnosPage', () => {
  let component: OrdenCompletaTurnosPage;
  let fixture: ComponentFixture<OrdenCompletaTurnosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrdenCompletaTurnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
