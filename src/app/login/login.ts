import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private apiUrl = 'https://localhost:7208/api/Auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post(this.apiUrl, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = "Invalid username or password";
      }
    });
  }
}
