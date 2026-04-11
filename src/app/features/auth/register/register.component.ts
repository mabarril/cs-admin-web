import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['counselor', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password, fullName, role } = this.registerForm.value;
    const result = await this.authService.signUp(email, password, fullName, role as UserRole);

    this.loading = false;

    if (result.success) {
      this.successMessage = result.error || 'Conta criada com sucesso! Aguarde a aprovação.';
      this.registerForm.reset({ role: 'counselor' });
    } else {
      this.errorMessage = result.error || 'Erro ao criar conta.';
    }
  }

  get fullName() { return this.registerForm.get('fullName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get role() { return this.registerForm.get('role'); }
}
