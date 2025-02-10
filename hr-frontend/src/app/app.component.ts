import { Component } from '@angular/core';
import { EmployeeComponent } from './employee/employee.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [EmployeeComponent],
})
export class AppComponent {
  title = 'hr-app';
}
