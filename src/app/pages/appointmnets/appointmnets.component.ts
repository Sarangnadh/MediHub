import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../../services/data.service';
import { Doctor } from '../../doctor';
import { interval, Subscription } from 'rxjs';
import { Appointment } from '../../appointment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-appointmnets',
  imports: [CommonModule, MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatAccordion,
    MatExpansionModule


  ],
  templateUrl: './appointmnets.component.html',
  styleUrl: './appointmnets.component.css'
})
export class AppointmnetsComponent implements OnInit, OnDestroy {
  appointmentForm: FormGroup;
  showForm = false;
  searchQuery = '';
  showAppointments = false;

  private refreshSubscription!: Subscription;
  allDoctors: Doctor[] = [];
  formValueDoc: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  bookedAppointments: Appointment[] = [];
  selectedBookingIndex: number | null = null
  selectedBooking: Appointment | null = null;
  appt: any;


  constructor(private fb: FormBuilder, private data: DataService, private snackBar: MatSnackBar, private dialog: MatDialog,) {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      doctor: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      notes: ['']
    });
    this.getAppointments();
    console.log(this.getAppointments());

  }
  ngOnInit(): void {
    this.loadDoctors();
    this.refreshSubscription = interval(3000000).subscribe(() => {
      this.loadDoctors();
    });
  }
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); // Cleanup on destroy
    }
  }

  loadDoctors() {
    this.data.getDoctors().subscribe((doctors) => {
      // this.allDoctors = doctors;
      // this.filteredDoctors = doctors
      this.allDoctors = this.shuffleArray(doctors);
      this.formValueDoc = doctors;
      this.filterDoctors();
      this.getAppointments();
    });
  }
isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

toggleForm() {
  if (!this.isLoggedIn) {
    alert('Please login to book an appointment.');
    return;
  }
  this.showForm = !this.showForm;
}

toggleAppointments() {
  if (!this.isLoggedIn) {
    alert('Please login to view your appointments.');
    return;
  }
  this.showAppointments = !this.showAppointments;
}

  shuffleArray(array: Doctor[]): Doctor[] {
    return array.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
  }


  filterDoctors() {

    const query = this.searchQuery.toLowerCase();
    this.filteredDoctors = this.allDoctors.filter(doc =>
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query)
    );

  }

  getAppointmentStatus(date: Date | string): string {
    const bookingDate: Date = date instanceof Date ? date : new Date(date);
    const currentDate = new Date();

    // Reset time for accurate comparison
    bookingDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const timeDiff = bookingDate.getTime() - currentDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (dayDiff > 7 && dayDiff <= 14) {
      return 'Status waiting';
    } else if (dayDiff >= 0 && dayDiff <= 7) {
      return 'processing for confirmation';
    }
    else if (dayDiff > 15) {
      return 'Staus pending...'
    }
    else {
      return 'invalid date'; // optional: handle past dates
    }
  }

  getAppointments() {
    this.data.getBookingDetails().subscribe(result => {
      console.log(result);
      this.bookedAppointments = result
      this.showForm = false;
    })
  }


  addBooking() {
    if (!this.data.isLoggedIn()) {
      this.snackBar.open('Please log in to book an appointment.', 'Close', {
        duration: 3000,
        panelClass: ['snack-error']
      });
      return;
    }
    if (this.appointmentForm.valid) {
      const date = this.appointmentForm.value.date as any;

      const formDate = this.appointmentForm.value.date;
      const status = this.getAppointmentStatus(formDate);
      const userId = localStorage.getItem('userId') ?? undefined;

      const newAppointment: Appointment = {
        name: this.appointmentForm.value.name || '',
        age: this.appointmentForm.value.age || '',
        doctor: this.appointmentForm.value.doctor || '',
        date: date instanceof Date ? date : new Date(),
        time: this.appointmentForm.value.time || '',
        phone: this.appointmentForm.value.phone || '',
        email: this.appointmentForm.value.email || '',
        notes: this.appointmentForm.value.note || '',
        status: status,
      };
      this.data.addAppointment(newAppointment).subscribe({
        next: (result) => {
          console.log('booking Confirmed:', result);
          this.snackBar.open('Appointment booked successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.appointmentForm.reset();
          this.getAppointments();
        },
        error: (err) => {
          console.error('Error for booking:', err);
          this.snackBar.open('Failed to book appointment. Try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }

  formatDateForInput(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  openEditModal(booking: Appointment, index: number) {
    this.selectedBooking = booking
    this.selectedBookingIndex = index + 1;
    const formattedDate = this.formatDateForInput(booking.date);
    // Patch form fields
    this.appointmentForm.patchValue({
      name: booking.name,
      age: booking.age,
      doctor: booking.doctor,
      date: formattedDate,
      time: booking.time,
      phone: booking.phone,
      email: booking.email,
      notes: booking.notes
    });

    console.log('Raw date:', booking.date);
    console.log('Formatted date:', formattedDate);

  }

  editbooking() {
    if (this.selectedBooking && this.selectedBooking._id) {
      const formDate = this.appointmentForm.value.date;
      const status = this.getAppointmentStatus(formDate)
      const updatedAppointments: Appointment = {
        _id: this.selectedBooking._id,
        name: this.appointmentForm.value.name,
        age: this.appointmentForm.value.age,
        doctor: this.appointmentForm.value.doctor,
        date: this.appointmentForm.value.date,
        time: this.appointmentForm.value.time,
        phone: this.appointmentForm.value.phone,
        email: this.appointmentForm.value.email,
        notes: this.appointmentForm.value.notes,
        status: status

      };

      // Call service to update doctor
      this.data.editBooking(this.selectedBooking._id, updatedAppointments).subscribe({
        next: (response) => {
          console.log('Booking updated successfully:', response);
          this.snackBar.open('Booking updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.getAppointments();
          this.appointmentForm.reset();
        },
        error: (error) => {
          console.error('Error updating  Appontment:', error);
          this.snackBar.open('Failed to updating  Appontment. Try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }

  deleteBooking(id: string | undefined) {
    if (!id) return; // Guard clause to prevent crash if ID is undefined
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: 'Are you sure you want to   Cancel your Appointment?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.deleteAppointment(id).subscribe(() => {
          this.snackBar.open('Booking Deleted Successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.getAppointments();
        });
      }
    })
  }
}
