import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../registration.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../user-model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  registeredData: User[] = [];
  userData: any;

  constructor(private service: RegistrationService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {

    this.service.getRegisterData().subscribe(
      (data: User[]) => {
        this.registeredData = data;
      },
      (error: any) => {
        console.error("Error fetching registered data:", error);
      }
    );
  }

  viewUser(userId: number) {
    Swal.fire({
      title: 'View User Details',
      text: 'Do you want to view the user details in a popup or navigate to a new page?',
      showCancelButton: true,
      confirmButtonText: 'View in Popup',
      cancelButtonText: 'Navigate to View',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.showUserDetailsPopup(userId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        const urlTree = this.router.createUrlTree(['/view', userId]);
        const url = this.router.serializeUrl(urlTree);
        window.open(url, '_blank');
      }
    });
  }

  showUserDetailsPopup(userId: number) {
    this.spinner.show();
    this.service.getUserDetails(userId).subscribe(
      response => {
        this.userData = response;
        this.spinner.hide();

        const userDetailsHTML = this.formatUserDetails(response);

        Swal.fire({
          title: 'User Details',
          html: userDetailsHTML,
          icon: 'info'
        });
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

  formatUserDetails(user: any): string {
    return `
    <div class="card">
    <div>
        <strong>User Name:</strong> ${user.userName}
      </div><br/>
      <div>
        <strong>First Name:</strong> ${user.firstName}
      </div><br/>
      <div>
        <strong>Last Name:</strong> ${user.lastName}
      </div><br/>
      <div>
        <strong>Email:</strong> ${user.email}
      </div><br/>
      <div>
        <strong>Phone Number:</strong> ${user.phoneNumber}
      </div><br/>
      </div>
    `;
  }

  deleteUser(userId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.service.deleteUser(userId).pipe(
          finalize(() => {
            this.spinner.hide();
            window.location.reload();
          })
        ).subscribe(
          result => {
            Swal.fire(
              'Deleted!',
              'User has been deleted.',
              'success'
            );
          },
          error => {
            Swal.fire(
              'Error!',
              'User deletion encountered an error.',
              'error'
            );
          }
        );

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'User deletion was cancelled',
          'info'
        );
      }
    });
  }
}



