import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  userid: any;
  registeredData:any;
  index: number = undefined as any;
  viewUser: any;
  updatePage: any;
  id: any;
  password: any;
  confirmPassword: any;

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: RegistrationService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.viewUser = this.formBuilder.group({
      userName: this.formBuilder.control(''),
      firstName: this.formBuilder.control(''),
      lastName: this.formBuilder.control(''),
      email: this.formBuilder.control(''),
      phoneNumber: this.formBuilder.control('')
    });
    this.userid = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    this.spinner.show();
    this.service.getUserDetails(this.userid).subscribe(
      response => {
        this.registeredData = response;
        this.viewUser.setValue({
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
}
