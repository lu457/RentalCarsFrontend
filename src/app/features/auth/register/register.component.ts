import { Component } from '@angular/core';
import { RegisterFormComponent } from "./register-form/register-form.component";

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [RegisterFormComponent]
})
export class RegisterComponent {

}
