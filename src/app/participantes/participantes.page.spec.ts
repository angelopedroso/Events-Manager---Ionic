import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantesPage } from './participantes.page';

describe('ParticipantesPage', () => {
  let component: ParticipantesPage;
  let fixture: ComponentFixture<ParticipantesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParticipantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
