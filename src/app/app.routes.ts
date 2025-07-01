import { Routes ,} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DoctorsPageComponent } from './pages/doctors-page/doctors-page.component';
import { AppointmnetsComponent } from './pages/appointmnets/appointmnets.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './auth.guard';
import { MyprofileComponent } from './pages/myprofile/myprofile.component';
import { DoctorViewComponent } from './pages/doctor-view/doctor-view.component';

export const routes: Routes = [
    {
        path:'home',
        component:HomeComponent,
    },
    {
        path:'',redirectTo:'home',
        pathMatch:'full'
    },
    {
        path:'doctors',
        component:DoctorsPageComponent,
        
    },
    {
        path:'patientsDetails',
        component:PatientsComponent
    },
    {
        path:'appointments',
        component:AppointmnetsComponent,
      
        
    },
    {
        path:'contactus',
        component:ContactComponent
    },
     {
        path:'login',
        component:LoginComponent,
        
    },
     {
        path:'register',
        component:RegisterComponent,
    },
     {
        path: 'doctorView',
        component: DoctorViewComponent
    },
{
    path:'admin-dashboard',
    component:AdminComponent,
    canActivate:[authGuard]
},
{
    path:'MyProfile',
    component:MyprofileComponent,
    canActivate:[authGuard]
}
];
