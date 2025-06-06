import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../services/data.service';
import { Doctor } from '../../doctor';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctors-page',
  imports: [CommonModule, MatCardModule, MatButton, ReactiveFormsModule,],
  templateUrl: './doctors-page.component.html',
  styleUrl: './doctors-page.component.css',

})
export class DoctorsPageComponent {
  featuredDoctors: Doctor[] = []
  allDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDoctor: Doctor | null = null;
  selectedDoctorIndex: number | null = null;



  doctorDetailsForm = new FormGroup({
    doctorName: new FormControl('', []),
    doctorSpecialty: new FormControl('', []),
    doctorExperience: new FormControl('', []),
    doctorImage: new FormControl('', []),
    availableDays: new FormArray([], [Validators.required])

  })

  isDaySelected(day: string): boolean {
    const daysArray = this.doctorDetailsForm.get('availableDays') as FormArray;
    return daysArray.value.includes(day);
  }


  onDayToggle(day: string, event: any) {
    const daysArray = this.doctorDetailsForm.get('availableDays') as FormArray;
    if (event.target.checked) {
      daysArray.push(new FormControl(day));
    } else {
      const index = daysArray.controls.findIndex(control => control.value === day);
      if (index !== -1) {
        daysArray.removeAt(index);
      }
    }
  }
  constructor(private data: DataService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.getDoctors()
  }

  getDoctors() {
    this.data.getDoctors().subscribe(result => {
      console.log(result);
      this.featuredDoctors = result
    })
  }
  addDoctor() {
    if (this.doctorDetailsForm.valid) {
      const newDoctor: Doctor = {
        name: this.doctorDetailsForm.value.doctorName || '',
        specialty: this.doctorDetailsForm.value.doctorSpecialty || '',
        experience: this.doctorDetailsForm.value.doctorExperience || '',
        image: this.doctorDetailsForm.value.doctorImage || '',
        day: this.doctorDetailsForm.value.availableDays || []
      };

      this.data.addDoctor(newDoctor).subscribe({
        next: (result) => {
          console.log('Doctor added:', result);
          this.snackBar.open('Doctor added successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success'] // Optional: style class
          });
          this.getDoctors(); // Refresh list
          this.doctorDetailsForm.reset();
          const daysArray = this.doctorDetailsForm.get('availableDays') as FormArray;
          while (daysArray.length !== 0) {
            daysArray.removeAt(0);
          }
        },
        error: (err) => {
          console.error('Error adding doctor:', err);
          this.snackBar.open('Failed to add Doctor. Try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }

  addNewData() {
    this.doctorDetailsForm.reset();

  }

  openEditModal(doctor: Doctor, index: number) {
    this.selectedDoctor = doctor;
    this.selectedDoctorIndex = index + 1; // store the index if needed

    // Clear the FormArray first
    const daysArray = this.doctorDetailsForm.get('availableDays') as FormArray;
    while (daysArray.length) {
      daysArray.removeAt(0);
    }
    // Patch form fields
    this.doctorDetailsForm.patchValue({
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorExperience: doctor.experience,
      doctorImage: doctor.image
    });

    // Patch availableDays
    doctor.day.forEach((day: string) => {
      daysArray.push(new FormControl(day));
    });
    console.log('Editing doctor at index:', this.selectedDoctorIndex);
  }

  EditDoc() {
    if (this.selectedDoctor && this.selectedDoctor._id) {
      const updatedDoctor: Doctor = {
        _id: this.selectedDoctor._id,
        name: this.doctorDetailsForm.value.doctorName ?? '',
        specialty: this.doctorDetailsForm.value.doctorSpecialty ?? '',
        image: this.doctorDetailsForm.value.doctorImage ?? '',
        experience: this.doctorDetailsForm.value.doctorExperience ?? '',
        day: (this.doctorDetailsForm.get('availableDays') as FormArray).value ?? []
      };
      // Call service to update doctor
      this.data.editDoctor(this.selectedDoctor._id, updatedDoctor).subscribe({
        next: (response) => {
          console.log('Doctor updated successfully:', response);
          this.snackBar.open('Doctor updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.getDoctors();
        },
        error: (error) => {
          console.error('Error updating doctor:', error);
          this.snackBar.open('Error updating doctor. Try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }
  deleteDoctor(id: string | undefined) {
    if (!id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: 'Are you sure you want to delete this doctor?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.deleteDoctor(id).subscribe(() => {
          this.snackBar.open('Deleted Successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });

          this.getDoctors();
        });
      }
    })
  }
}