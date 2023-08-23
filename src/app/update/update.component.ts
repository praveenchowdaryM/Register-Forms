import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RegistrationService } from '../registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  id: any;
  password: any;
  confirmPassword: any;
  userid: any;
  updatePage: any;
  index: number = undefined as any;

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: RegistrationService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {

    this.updatePage = this.formBuilder.group({
      userName: this.formBuilder.control(''),
      firstName: this.formBuilder.control(''),
      lastName: this.formBuilder.control(''),
      email: this.formBuilder.control(''),
      phoneNumber: this.formBuilder.control('')
    });
    this.userid = this.route.snapshot.queryParams['id'];
    this.fetchDetails()
  }

  fetchDetails() {
    this.spinner.show();
    this.service.getUserDetails(this.userid).subscribe(
      response => {
        this.updatePage.setValue({
          userName: response.userName,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          phoneNumber: response.phoneNumber
        });
        this.id = response.id;
        this.password = response.password;
        this.confirmPassword = response.confirmPassword;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error while fetching UserDetails',
        });
      }
    );
  }

  save() {
    this.spinner.show();
    const updatedData = {
      ...this.updatePage.value,
      id: this.id,
      password: this.password,
      confirmPassword: this.confirmPassword
    };
    this.service.updatedUserData(updatedData).subscribe(
      (data: any) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User Updated successfully!'
        }).then(() => {
          this.updatePage.reset();
          this.router.navigateByUrl('/dashboard');
        });
      },
      (error: any) => {
        this.spinner.hide();
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error occurred while updating User!'
        });
      }
    );
  }
}
