// src/app/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Employee {
  id: number | undefined; // Only required when updating employee record
  name: string;
  salary: number | undefined;
  deductions: number | undefined;
  netPay?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/api/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    const salary = employee.salary ?? 0;
    const deductions = employee.deductions ?? 0;
    employee.netPay = salary - deductions;
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  // Update Name
  updateEmployeeName(id: number, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/name`, { name });
  }

  // Update Salary
  updateEmployeeSalary(id: number, salary: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/salary`, { salary });
  }

  // Update Deductions
  updateEmployeeDeductions(id: number, deductions: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deductions`, { deductions });
  }

  // General Update Function (for name, salary, and deductions)
  updateEmployee(id: number, updates: Partial<Employee>): Observable<any> {
    const requests: Observable<any>[] = [];

    if (updates.name !== undefined) {
      requests.push(this.updateEmployeeName(id, updates.name));
    }
    if (updates.salary !== undefined) {
      requests.push(this.updateEmployeeSalary(id, updates.salary));
    }
    if (updates.deductions !== undefined) {
      requests.push(this.updateEmployeeDeductions(id, updates.deductions));
    }

    return new Observable((observer) => {
      let completedRequests = 0;
      requests.forEach((request) =>
        request.subscribe(
          () => {
            completedRequests++;
            if (completedRequests === requests.length) {
              observer.next({ message: 'Employee updated successfully' });
              observer.complete();
            }
          },
          (error) => observer.error(error)
        )
      );
    });
  }
}
