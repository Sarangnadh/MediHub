import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { DataService } from '../../services/data.service';
import { User } from '../../user';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  imports: [CommonModule,MatIcon,MatCardHeader,MatCard, MatCardContent,],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  allUsers:User[]=[];
  
constructor( private dataService:DataService){
  this.getUsers();
}



getUsers()
{
   this.dataService.getUsers().subscribe(result => {
      console.log("users",result);
      this.allUsers = result
    })
}
editUser(user: any) {
  // Open edit modal or route to user edit page
  console.log('Edit user', user);
}

deleteUser() {
  if (confirm('Are you sure you want to delete this user?')) {
    // this.dataService.deleteUser(userId).subscribe(() => {
    //   this.allUsers = this.allUsers.filter(u => u._id !== userId);
    // });
  }
}

}
