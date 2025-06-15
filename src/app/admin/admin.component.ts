import { Component, OnInit } from '@angular/core';
import { Appointment } from '../appointment';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import {ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart as ApexChartType,
  NgApexchartsModule
} from 'ng-apexcharts';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../user';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { UsersComponent } from "../pages/users/users.component";

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChartType;
  labels: string[];
  responsive: ApexResponsive[];
};
@Component({
  selector: 'app-admin',
  imports: [CommonModule, NgApexchartsModule, RouterModule, MatIcon, MatIconButton, ReactiveFormsModule, FormsModule,  UsersComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AdminComponent implements OnInit{
 totalPatients = 0;
  totalAppointments = 0;
  activeDoctors = 0;
  totalusers=0
  recentAppointments: Appointment[] = [];
  bookedAppointments: Appointment[] = [];
allUsers:User[]=[];
   lineChartOptions!: LineChartOptions;
  pieChartOptions!: PieChartOptions;
  showAppointments = false;
  showUsers = false;
showDashboard=false
activeMenu: string = 'dashboard'; 

showSidebar = false;

  constructor(private dataService: DataService,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadDashboardData();
      this.initializeCharts();
  }
 toggleAppointments() {
    this.showAppointments = true;
    this.showUsers = false;
    this.activeMenu = 'appointments';
  }

  toggleUsers() {
    this.showUsers = true;
    this.showAppointments = false;
    this.activeMenu= 'users';
  }
setActiveMenu(menu: string) {
  this.activeMenu = menu;
    this.showAppointments=false;
    this.showDashboard = menu === 'dashboard';
  this.showUsers = menu === 'users';
  this.showAppointments = menu === 'appointments';
}
selectStatus() :boolean{
   return this.recentAppointments.some(app => 
    app.status !== app.originalStatus && app.status !== ''
  ); 
}



toggleSidebar() {
  this.showSidebar = !this.showSidebar;
}
openEditModal(booking: Appointment, index: number){}
deleteBooking(id: string | undefined) {
  if (!id) return;

  if (confirm('Are you sure you want to delete this appointment?')) {
    this.dataService.adminDeleteAppointment(id).subscribe({
      next: (res) => {
        this.snackBar.open('Appointment deleted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snack-success']
        });

        // Update the UI after deletion
        this.recentAppointments = this.recentAppointments.filter(app => app._id !== id);
        this.bookedAppointments = this.bookedAppointments.filter(app => app._id !== id);
        this.totalAppointments--; // Update total count

        this.initializeCharts(); // Re-render charts
      },
      error: (err) => {
        console.error('Error deleting appointment:', err);
        this.snackBar.open('Failed to delete appointment.', 'Close', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }
}


  loadDashboardData() {
    this.dataService.getPatientsDetails().subscribe(patients => {
      this.totalPatients = patients.length;
      this.initializeCharts();
    });


    this.dataService.getUsers().subscribe(users=>{
      this.totalusers=users.length
      this.initializeCharts();
    })

    this.dataService.getDoctors().subscribe(doctors => {
      this.activeDoctors = doctors.length;
            this.initializeCharts();

    });
    

    this.dataService.allBookingDetails().subscribe(appointments => {
      this.totalAppointments = appointments.length;
      this.bookedAppointments=appointments
      this.recentAppointments = appointments.slice(-10).reverse().map(app => ({
    ...app,
    originalStatus: app.status // 🔄 Store original status for change detection
  }));; 
       
  
      const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon to Sun

  appointments.forEach(app => {
    const date = new Date(app.date); // assuming app.date is ISO string or timestamp
    const day = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    // Shift so that Monday is index 0, Sunday is last
    const index = (day + 6) % 7;
    dayCounts[index]++;
  });

  this.initializeChart(dayCounts);
      
    });
  }



  updateStatus() {
  console.log('All statuses updated:', this.recentAppointments);
  this.recentAppointments.forEach(appointment => {
    if ( appointment._id&&appointment.status && appointment.status !== appointment.originalStatus) {
      this.dataService.updateAppointmentStatus(appointment._id, appointment.status).subscribe({
        next: res => {
          console.log('✅ Status updated:', res);
            this.snackBar.open('✅ Appointment Status Confirmed successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          appointment.originalStatus = appointment.status; // update local copy
        },
         error: (err) => {
          console.error('❌ Error updating status:', err)
          this.snackBar.open('❌ Failed to confirm appointment. Try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  });
}


initializeChart(dayData: number[]) {
  this.lineChartOptions = {
    series: [
      {
        name: 'Appointments',
        data: dayData
      }
    ],
    chart: {
      type: 'line',
      height: 200
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };
}

 initializeCharts() {
        this.pieChartOptions = {
      series: [this.totalPatients, this.activeDoctors, this.totalAppointments,this.totalusers],
      chart: {
        type: 'pie'
      },
      labels: ['Patients', 'Doctors', 'Appointments','Registered Users'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }
}
