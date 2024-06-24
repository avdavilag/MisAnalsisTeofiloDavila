import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescargaFacturasPage } from './descarga-facturas.page';

describe('DescargaFacturasPage', () => {
  let component: DescargaFacturasPage;
  let fixture: ComponentFixture<DescargaFacturasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DescargaFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
