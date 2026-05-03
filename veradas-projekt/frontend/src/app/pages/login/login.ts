import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form = {
    email: '',
    password: '',
  };

  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {
    if (this.isSubmitting) return;

    this.errorMessage = '';

    if (!this.form.email || !this.form.password) {
      this.errorMessage = 'Az email és a jelszó megadása kötelező.';
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.form).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.router.navigate(['/locations']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Hiba történt a bejelentkezés során.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}