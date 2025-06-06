import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule,MatButtonModule,MatCardModule,MatIconModule,CanvasJSAngularChartsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  specialties = [
    { name: 'General Doctor', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722235992/8883702_d29bd6048d.png' },
    { name: 'Dentist', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722192930/dentist_5379586_66ef5d91c3.png' },
    { name: 'Cardiology', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722191590/cardio_12d1274b41.jpg' },
    { name: 'Skin', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722506545/doctor_12462705_eacc36be84.png' },
    { name: 'ENT specialist', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722194212/thumbnail_otology_1d1f7dd682.png' },
    { name: 'Female doctor', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722506316/doctor_8883710_456bda292b.png' },
    { name: 'Orthopedic Surgeon', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722193895/orthopedic_acb685586a.png' },
    { name: 'Psychotropic', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722317243/neurology_7356632_2cc111afcd.png' },
    { name: 'Neurologist', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722193920/neurologist_17972b8bd4.png' },
    { name: 'Eye Specialist', img: 'https://res.cloudinary.com/daf1fkwp5/image/upload/v1722316094/thumbnail_vision_14874083_98eb9f8246.png'},

  ];

 doctorCount = 0;
patientCount = 0;
appointments=0
chartOptions: any;
  role = localStorage.getItem('role');

  constructor( private route:Router,private data:DataService){ }
  ngOnInit(): void {
  setInterval(() => this.loadData(), 1000);

  }
loadData() {
  this.data.getDoctors().subscribe(doctors => {
    this.doctorCount = doctors.length;
    this.updateChart();
  });

  this.data.getPatientsDetails().subscribe(patients => {
    this.patientCount = patients.length;
    this.updateChart();
  });
  this.data.allBookingDetails().subscribe(bookings => {
    this.appointments =bookings.length;
    this.updateChart();
  });

}
  updateChart(){
this.chartOptions = {
    animationEnabled: true,
    theme: "dark2",
    exportEnabled: true,
    title: {
      text: "Doctor, Patient & Appointment Overview"
    },
    subtitles: [{
      text: "Live Updates"
    }],
    data: [{
      type: "pie",
      indexLabel: "{name}: {y}",
      dataPoints: [
        { name: "Doctors", y: this.doctorCount },
        { name: "Patients", y: this.patientCount },
        {name:"My Appointments", y:this.appointments}
      ]
    }]
  };
  }

  click(){
    this.route.navigateByUrl("appointments")
  }
}
