import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { provideHttpClient } from '@angular/common/http';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService, provideHttpClient()],
    });

    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
