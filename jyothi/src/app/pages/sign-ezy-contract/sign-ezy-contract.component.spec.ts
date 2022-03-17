import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignEzyContractComponent } from './sign-ezy-contract.component';

describe('SignEzyContractComponent', () => {
  let component: SignEzyContractComponent;
  let fixture: ComponentFixture<SignEzyContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignEzyContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignEzyContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
