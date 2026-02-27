import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Recuperar Senha</h2>
          <p class="mt-2 text-sm text-gray-600">
            Digite seu email para receber instruções de recuperação
          </p>
        </div>

        @if (successMessage) {
          <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p class="text-sm">{{ successMessage }}</p>
          </div>
        }

        @if (errorMessage) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p class="text-sm">{{ errorMessage }}</p>
          </div>
        }

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="seu@email.com"
            />
          </div>

          <button
            type="submit"
            [disabled]="resetForm.invalid || loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ loading ? 'Enviando...' : 'Enviar Email de Recuperação' }}
          </button>

          <div class="text-center">
            <a routerLink="/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition">
              Voltar para Login
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: []
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    resetForm: FormGroup;
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor() {
        this.resetForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    async onSubmit(): Promise<void> {
        if (this.resetForm.invalid) return;

        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        const { email } = this.resetForm.value;
        const result = await this.authService.resetPassword(email);

        this.loading = false;

        if (result.success) {
            this.successMessage = 'Email de recuperação enviado! Verifique sua caixa de entrada.';
            this.resetForm.reset();
        } else {
            this.errorMessage = result.error || 'Erro ao enviar email';
        }
    }
}
