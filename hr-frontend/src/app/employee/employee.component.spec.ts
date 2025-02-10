import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeComponent } from './employee.component';
import { EmployeeService } from '../employee.service';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeComponent, FormsModule],
      providers: [
        importProvidersFrom(HttpClientModule),
        provideHttpClientTesting(),
        EmployeeService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty employee list initially', () => {
    expect(component.employees.length).toBe(0);
  });

  it('should open and close the add employee modal', () => {
    component.openAddModal();
    expect(component.showAddModal).toBeTrue();

    component.closeAddModal();
    expect(component.showAddModal).toBeFalse();
  });

  it('should open and close the edit employee modal', () => {
    const mockEmployee = {
      id: 1,
      name: 'John Doe',
      salary: 50000,
      deductions: 5000,
    };
    component.openEditModal(mockEmployee);
    expect(component.showEditModal).toBeTrue();
    expect(component.selectedEmployee).toEqual(mockEmployee);

    component.closeEditModal();
    expect(component.showEditModal).toBeFalse();
    expect(component.selectedEmployee).toBeNull();
  });
});
