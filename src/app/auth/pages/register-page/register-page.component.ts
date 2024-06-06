import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent {

  private formBuilder = inject( FormBuilder );
  private authService = inject( AuthService );
  private router = inject( Router );

  public registerForm: FormGroup = this.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)] ],
      email: ['', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      age: [ [Validators.required, Validators.maxLength(2)] ],
    }
  );

  register() {

    const registerFormValues = this.registerForm.value;

    this.authService.register( registerFormValues )
        .subscribe({
                next: () => { 

                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Se ha registrado con éxito",
                    showConfirmButton: false,
                    timer: 1500
                  });
                  this.router.navigateByUrl('/auth/login');

                },
                error: (message) => {
                    Swal.fire('Los datos que proporcionó son inválidos', message, 'error' ); 
                }
            }
    );

  }

}
