import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { Doctor } from '../../doctor';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-doctor-view',
  imports: [CommonModule,MatCard,MatCardModule,MatCard,MatFormField,FormsModule,MatInputModule ],
  templateUrl: './doctor-view.component.html',
  styleUrl: './doctor-view.component.css'
})
export class DoctorViewComponent implements OnInit {
 searchControl = new FormControl('');
 
   private refreshSubscription!: Subscription;
 
  allDoctors: Doctor[] = [];
  filteredDoctors: any[] = [];
  searchQuery = '';
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchDoctors();
this.loadDoctors();
    this.refreshSubscription = interval(3000000).subscribe(() => {
      this.loadDoctors();
    });
    
  }

  loadDoctors() {
    this.dataService.getDoctors().subscribe((doctors) => {
      // this.allDoctors = doctors;
      // this.filteredDoctors = doctors
      this.allDoctors = this.shuffleArray(doctors);
      // this.formValueDoc = doctors;
      this.filterDoctors();
    });
  }
  fetchDoctors(): void {
    this.dataService.getDoctors().subscribe(doctors => {
      this.allDoctors = doctors;
      this.filteredDoctors = doctors;
    });
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

}
