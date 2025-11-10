import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUsuarios } from './config-usuarios';

describe('ConfigUsuarios', () => {
  let component: ConfigUsuarios;
  let fixture: ComponentFixture<ConfigUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
