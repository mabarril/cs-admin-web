import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ROLE_NAMES, UserRole } from '../../../core/models/user-profile.model';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './usuarios.component.html',
    styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }
    .form-input, .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 1rem;
    }
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .btn-submit {
      width: 100%;
      padding: 0.75rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .btn-submit:hover {
      background-color: #1d4ed8;
    }
    .btn-submit:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    .error-text {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .alert-success {
      background-color: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .alert-danger {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
  `]
})
export class UsuariosComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    usuarioForm: FormGroup;
    isLoading = false;
    successMessage = '';
    errorMessage = '';

    // Roles explicitly allowed to be assigned in the system
    availableRoles: { id: UserRole, name: string }[] = [
        { id: 'admin', name: ROLE_NAMES['admin'] },
        { id: 'secretary', name: ROLE_NAMES['secretary'] },
        { id: 'treasury', name: ROLE_NAMES['treasury'] },
        { id: 'counselor', name: ROLE_NAMES['counselor'] },
        { id: 'board', name: ROLE_NAMES['board'] },
    ];

    constructor() {
        this.usuarioForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['counselor', [Validators.required]]
        });
    }

    async onSubmit() {
        if (this.usuarioForm.invalid) {
            this.usuarioForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        const formValues = this.usuarioForm.value;

        // Call the signUp service
        const result = await this.authService.signUp(
            formValues.email,
            formValues.password,
            formValues.fullName,
            formValues.role as UserRole
        );

        this.isLoading = false;

        if (result.success) {
            this.successMessage = result.error || 'Usuário cadastrado com sucesso! Um e-mail de confirmação foi enviado ao destinatário.';
            this.usuarioForm.reset({ role: 'counselor' });
        } else {
            this.errorMessage = result.error || 'Ocorreu um erro ao criar a conta.';
        }
    }
}
