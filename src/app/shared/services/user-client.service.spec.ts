import { TestBed } from '@angular/core/testing';

import { UserClient } from './user-client.service';

describe('UserClient', () => {
  let service: UserClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
