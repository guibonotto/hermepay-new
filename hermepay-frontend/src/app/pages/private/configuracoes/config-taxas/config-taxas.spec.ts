import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTaxas } from './config-taxas';

describe('ConfigTaxas', () => {
  let component: ConfigTaxas;
  let fixture: ComponentFixture<ConfigTaxas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigTaxas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigTaxas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
