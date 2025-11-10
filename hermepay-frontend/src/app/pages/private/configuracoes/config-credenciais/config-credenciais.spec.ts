import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCredenciais } from './config-credenciais';

describe('ConfigCredenciais', () => {
  let component: ConfigCredenciais;
  let fixture: ComponentFixture<ConfigCredenciais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigCredenciais]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigCredenciais);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
