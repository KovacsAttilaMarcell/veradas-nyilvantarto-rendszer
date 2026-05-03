import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form = {
    email: '',
    password: '',
  };

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  register(): void {
    if (this.isSubmitting) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.email || !this.form.password) {
      this.errorMessage = 'Az email és a jelszó megadása kötelező.';
      return;
    }

    this.isSubmitting = true;

    this.authService.register(this.form).subscribe({
      next: () => {
        this.successMessage = 'Sikeres regisztráció.';
        this.form = {
          email: '',
          password: '',
        };
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Hiba történt a regisztráció során.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}