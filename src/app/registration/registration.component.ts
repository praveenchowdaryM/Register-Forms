import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from '../registration.service';
import { Router } from '@angular/router'; // Make sure to import Router
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private service: RegistrationService,
    private spinner: NgxSpinnerService, // Inject NgxSpinnerService
    private router: Router // Inject Router
  ) { }

  submitted = false;
  registrationPage: any;

  ngOnInit(): void {
    this.registrationPage = this.formBuilder.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
    });
  }

  register() {
    this.service.registeredData(this.registrationPage.value)
      .subscribe(
        (data: any) => {
          this.spinner.hide();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User added successfully!'
          }).then(() => {
            this.registrationPage.reset();
            this.router.navigateByUrl('/registration');
          });
        },
        (error: any) => {
          this.spinner.hide();
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error occurred while adding User!'
          });
        }
      );
  }
}
