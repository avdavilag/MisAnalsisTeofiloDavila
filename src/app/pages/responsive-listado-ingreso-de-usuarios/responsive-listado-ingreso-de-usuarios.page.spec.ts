import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsiveListadoIngresoDeUsuariosPage } from './responsive-listado-ingreso-de-usuarios.page';

describe('ResponsiveListadoIngresoDeUsuariosPage', () => {
  let component: ResponsiveListadoIngresoDeUsuariosPage;
  let fixture: ComponentFixture<ResponsiveListadoIngresoDeUsuariosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResponsiveListadoIngresoDeUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
