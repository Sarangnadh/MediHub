import { Component, OnInit, ViewChild } from '@angular/core';
import { Appointment } from '../../appointment';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { User } from '../../user';


@Component({
  selector: 'app-myprofile',
  imports: [CommonModule, MatCard, MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatAccordion,
    MatToolbarModule],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.css'
})
export class MyprofileComponent implements OnInit {
  name: string | null = '';
  email: string | null = '';
loggedUser?: User;

  userDetail:User[]=[];
  bookedAppointments: Appointment[] = [];
  approvedAppointments: Appointment[] = [];
  cancelledAppointments: Appointment[] = []
  deletedAppointments: Appointment[] = [];

  notifications: { message: string, date: Date }[] = [];
  selectedTab = 0;
  isMobile: boolean = false;
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
    this.getAppointments();
    this.getNotifications();
    this.getApprovedApointments();
    this.getCancelledApointments();
    this.getDeletedAppointments();
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
          this.getUsers();

  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
  getAppointments() {
    this.dataService.getBookingDetails().subscribe({
      next: (result) => {
        console.log('booking', result);
        this.bookedAppointments = result
      },
      error: (err) => {
        console.error('Failed to fetch Appointments', err);
      }
    })
  }
  getNotifications() {
    this.dataService.getNotifications().subscribe({
      next: (response) => {
        console.log('Notifications:', response);
        this.notifications = response.notifications;
      },
      error: (err) => {
        console.error('Failed to fetch notifications', err);
      }
    });
  }
  getApprovedApointments() {
    this.dataService.getApprovedAppointments().subscribe(result => {
      console.log("approved", result);
      this.approvedAppointments = result.ApprovedAppointments

    })
  }
 getCancelledApointments() {
    this.dataService.getCancelledAppointments().subscribe(result => {
      console.log("cancelled", result);
      this.cancelledAppointments = result.CancelledAppointments

    })
  }

getDeletedAppointments() {
  this.dataService.getUserDeletedAppointments().subscribe({
    next: (result) => {
      console.log("Deleted Appointments", result);
      this.deletedAppointments = result.userDeletedAppointments;
    },
    error: (err) => {
      console.error("Failed to fetch deleted appointments", err);
    }
  });
}
getUsers() {
  const currentEmail = localStorage.getItem('email');
  this.dataService.getUsers().subscribe(result => {
    this.userDetail = result;
    this.loggedUser = this.userDetail.find(user => user.email === currentEmail);
  });
}

}
