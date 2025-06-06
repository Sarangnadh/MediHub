import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Patient } from '../../patient';
import { DataService } from '../../services/data.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-patients',
  imports: [CommonModule, ReactiveFormsModule,
    MatMenu, MatMenuTrigger,
    MatButtonModule, MatCardModule,
    MatInputModule, MatDatepickerModule,
    MatFormFieldModule, MatIconModule,
    MatSelectModule, MatTableModule,
    MatSortModule, MatNativeDateModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {
  patients: Patient[] = [];
  displayedColumns: string[] = ['name', 'age', 'gender', 'contact', 'admitted', 'discharged', 'expenses', 'action'];
  isEditMode = false;
  patientIdToDelete: string | undefined;
  selectedPatient: Patient | null = null;
  selectedPatientIndex: number | null = null;
  paginatedPatients: Patient[] = [];
 pageNumber=1;
 itemsPerPage =10;
 totalItems=0;
  patientForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    age: new FormControl(0, []),
    gender: new FormControl('', []),
    contact: new FormControl('', []),
    admitted: new FormControl('', []),
    discharged: new FormControl('', []),
    expenses: new FormControl(0, []),
  })
  constructor(private data: DataService) {
    this.getPatients();
  }

  getPatients() {
    this.data.getPatientsDetails().subscribe(result => {
      this.patients = result
      this.totalItems=this.patients.length
        this.pageNumber = 1; 
      this.updateDisplayProducts();
    })
  }
  updateDisplayProducts(){
    const startIndex=(this.pageNumber-1)*this.itemsPerPage
        const endIndex= Math.min(this.pageNumber*this.itemsPerPage,this.totalItems)
 this.paginatedPatients = this.patients.slice(startIndex,endIndex)
  }
nextPage(){
  if(this.pageNumber<Math.ceil(this.totalItems/this.itemsPerPage)){
    this.pageNumber++;
    this.updateDisplayProducts();
  }
}
previousPage()
{
  if(this.pageNumber>1)
  {
    this.pageNumber--;
    this.updateDisplayProducts();
  }
}


updateItemsPerPage(event:Event){
this.itemsPerPage= +(event.target as HTMLSelectElement).value;
this.pageNumber=1;
this.updateDisplayProducts()
}

getDisplayRange():string{
  const start =(this.pageNumber-1)* this.itemsPerPage +1;
  const end =Math.min(this.pageNumber*this.itemsPerPage,this.totalItems);
return `show ${start}-${end} of ${this.totalItems} items`

}

  clearForm() {
    this.patientForm.reset();
    this.isEditMode = false;
    // this.editIndex = null;/
    this.selectedPatient = null;
  }

  onSubmit() {
    console.log("data", this.patientForm.value);
    if (this.patientForm.valid) {
      const admittedValue = this.patientForm.value.admitted as any;
      const dischargedValue = this.patientForm.value.discharged as any;
      const newPatient: Patient = {
        name: this.patientForm.value.name || '',
        age: Number(this.patientForm.value.age) || 0,
        gender: this.patientForm.value.gender || '',
        contact: this.patientForm.value.contact || '',
        admitted: admittedValue instanceof Date ? admittedValue : new Date(),
        discharged: dischargedValue instanceof Date ? dischargedValue : new Date(),
        expenses: Number(this.patientForm.value.expenses) || 0,
      };
      if (this.isEditMode) {
        this.editPatient()
      }
      else {

        this.data.addPatient(newPatient).subscribe({
          next: (result) => {
            console.log('Patient added to list:', result);
            this.getPatients();
            this.patientForm.reset();

          },
          error: (err) => {
            console.error('Error adding doctor:', err);
          }
        });
      }
    }
  }

  // EditRecords
  private mapPatientToForm(patient: Patient): any {
    return {
      name: patient.name ?? '',
      age: String(patient.age ?? ''),
      gender: patient.gender ?? '',
      contact: patient.contact ?? '',
      admitted: String(patient.admitted ?? ''),
      discharged: String(patient.discharged ?? ''),
      expenses: String(patient.expenses ?? ''),
    };
  }



  StartEdit(patient: Patient, index: number) {
    this.isEditMode = true
    this.selectedPatient = patient;
    this.selectedPatientIndex = index + 1; 
    this.patientForm.patchValue(this.mapPatientToForm(patient));
    console.log('Editing doctor at index:', this.selectedPatientIndex);
  }




  editPatient() {
    if (this.selectedPatient && this.selectedPatient._id) {
      const admittedValue = this.patientForm.value.admitted as any;
      const dischargedValue = this.patientForm.value.discharged as any;
      this.isEditMode = false;

      const updatedPatient: Patient = {
        name: this.patientForm.value.name || '',
        age: Number(this.patientForm.value.age) || 0,
        gender: this.patientForm.value.gender || '',
        contact: this.patientForm.value.contact || '',
        admitted: admittedValue instanceof Date ? admittedValue : new Date(),
        discharged: dischargedValue instanceof Date ? dischargedValue : new Date(),
        expenses: Number(this.patientForm.value.expenses) || 0,
      };
      this.data.updatePatientDetails(this.selectedPatient._id, updatedPatient).subscribe({
        next: (response) => {
          console.log('Doctor updated successfully:', response);
          this.getPatients();
          this.patientForm.reset();
        },
        error: (error) => {
          console.error('Error updating patients:', error);
        }
      });
    }
  }

  openDeleteModal(id: string | undefined) {
    this.patientIdToDelete = id;
  }

  handleDelete() {
    const redirectEl = document.getElementById('focusRedirect');
    redirectEl?.focus();

    if (this.patientIdToDelete) {
      this.deletePatientRecord(this.patientIdToDelete);
    }
  }

  prepareDelete(id: string | undefined) {
    this.patientIdToDelete = id;
  }

  deletePatientRecord(id: string | undefined) {
    const redirectEl = document.getElementById('focusRedirect');
    redirectEl?.focus();

    if (!id) return;
    this.data.deletePatient(id).subscribe(() => {
      alert("Deleted Successfully")
      this.getPatients();
    });
  }


  

}
