import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../appointment';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
  selector: 'app-myprofile',
  imports: [CommonModule,MatCard,MatCardModule,MatButtonModule,MatTabsModule,MatIconModule,MatListModule,MatSidenavModule],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.css'
})
export class MyprofileComponent implements OnInit {
 name: string | null = '';
  email: string | null = '';
  appointments: Appointment[] = [];
  bookedAppointments: Appointment[] = [];

 

  approvedAppointments = [];
  cancelledAppointments = [];
notifications: { message: string ,date:Date}[] = [];

  selectedTab = 0;

  createdAt = new Date('2024-01-10');

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
 this.getAppointments();
 this.getNotifications();
    

  }
  
  
  getAppointments() {
    this.dataService.getBookingDetails().subscribe(result => {
      console.log(result);
      this.bookedAppointments = result
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

}
