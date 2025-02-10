import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  imports: [FormsModule, CommonModule],
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  newEmployee: Employee = {
    id: undefined,
    name: '',
    salary: undefined,
    deductions: undefined,
  };
  selectedEmployee: Employee | null = null;
  showAddModal = false;
  showEditModal = false;
  loading = false;
  errorMessage = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.employeeService.getEmployees().subscribe(
      (employees) => {
        this.employees = employees;
      },
      (error) => {
        this.errorMessage = 'Error loading employees. Please try again.';
      }
    );
  }

  // Open Add Employee Modal
  openAddModal() {
    this.errorMessage = '';
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newEmployee = {
      id: undefined,
      name: '',
      salary: undefined,
      deductions: undefined,
    };
  }

  saveEmployee() {
    if (!this.newEmployee.name) {
      this.errorMessage = 'Name is required!';
      return;
    }

    this.loading = true;
    this.employeeService.addEmployee(this.newEmployee).subscribe(
      () => {
        this.fetchEmployees();
        this.closeAddModal();
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to add employee. Please try again.';
        this.loading = false;
      }
    );
  }

  openEditModal(employee: Employee) {
    this.errorMessage = '';
    this.selectedEmployee = { ...employee };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedEmployee = null;
  }

  saveChanges() {
    if (!this.selectedEmployee) return;

    const { id, name, salary, deductions } = this.selectedEmployee;

    if (!id) {
      this.errorMessage = 'Invalid employee selection.';
      return;
    }

    this.loading = true;
    this.employeeService
      .updateEmployee(id, { name, salary, deductions })
      .subscribe(
        () => {
          this.fetchEmployees();
          this.closeEditModal();
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Failed to update employee. Please try again.';
          this.loading = false;
        }
      );
  }
}
