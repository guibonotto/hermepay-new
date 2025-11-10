import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigWebhooks } from './config-webhooks';

describe('ConfigWebhooks', () => {
  let component: ConfigWebhooks;
  let fixture: ComponentFixture<ConfigWebhooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigWebhooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigWebhooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
