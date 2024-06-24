import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreartrackingordPage } from './creartrackingord.page';

describe('CreartrackingordPage', () => {
  let component: CreartrackingordPage;
  let fixture: ComponentFixture<CreartrackingordPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreartrackingordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
