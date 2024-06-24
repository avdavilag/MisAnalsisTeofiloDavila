import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineOrdenPage } from './timeline-orden.page';

describe('TimelineOrdenPage', () => {
  let component: TimelineOrdenPage;
  let fixture: ComponentFixture<TimelineOrdenPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimelineOrdenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
