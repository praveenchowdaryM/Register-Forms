import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from '../registration.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private service:RegistrationService, private spinner: NgxSpinnerService, private router: Router) { }
  submitted = false;
  loginPage: any;
  registrationPage: any;
  ngOnInit(): void {
    this.loginPage = this.formBuilder.group({
      userName: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
    });
  }

  login() {
    this.spinner.show();
    this.service
      .login(this.loginPage.value.userName, this.loginPage.value.password)
      .subscribe(
        (data: any) => {
          this.spinner.hide();
          // Use SweetAlert for success
          Swal.fire({
            icon: 'success',
            title: 'Login Success',
            text: 'You are logged in successfully!',
          }).then(() => {
            this.router.navigateByUrl('/dashboard');
          });
        },
        (error: any) => {
          this.spinner.hide();
          // Use SweetAlert for error
          Swal.fire({
            icon: 'error',
            title: 'Login Error',
            text: 'Invalid Username or Password.',
          });
        }
      );
  }


}
