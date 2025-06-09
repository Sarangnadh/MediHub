import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '../doctor';
import { Patient } from '../patient';
import { Observable } from 'rxjs';
import { Appointment } from '../appointment';
import { Admin } from '../admin';
import { User } from '../user';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

doctors = 'http://localhost:3000/doctors/getall';
adddoctor='http://localhost:3000/doctors/add'
editdoctor='http://localhost:3000/doctors/edit/'
deletedoctor='http://localhost:3000/doctors/delete/';

addpatient='http://localhost:3000/patients/addpatient'
patientsDetails = 'http://localhost:3000/patients/getPatients';
updatepatient='http://localhost:3000/patients/updatedPatientsDetails/'
deletepatientData='http://localhost:3000/patients/deletePatientDetails/'


addbooking='http://localhost:3000/appointments/bookappointment'
getbooking='http://localhost:3000/appointments/appointmentDetails'
editbooking='http://localhost:3000/appointments/editAppointment/'
deletebooking='http://localhost:3000/appointments/deleteAppointment/'
allBooking='http://localhost:3000/appointments/allAppointmentDetails'


 registerUserUrl = 'https://medihubserver.onrender.com/user/registerUser';
  registerAdminUrl = 'https://medihubserver.onrender.com/admin/registerAdmin';

  loginUserUrl = 'https://medihubserver.onrender.com/user/loginUser';
loginAdminUrl = 'https://medihubserver.onrender.com/admin/loginAdmin';
appDelAdmin='https://medihubserver.onrender.com/admin/deleteAppointment/'

  constructor(private http:HttpClient) { }

getDoctors()
{
  return this.http.get<Doctor[]>(this.doctors)
}
addDoctor(newDoctor: Doctor){
return this.http.post<Doctor[]>(this.adddoctor,newDoctor)
}


editDoctor(id: string, updatedDoctor: Doctor) {
   
  return this.http.put<Doctor>(this.editdoctor+`${id}`, updatedDoctor);
}


  deleteDoctor(id: string)  {
    return this.http.delete(this.deletedoctor+`${id}`);
  }


  // PatientsAPICall
  addPatient(newPatient:Patient){
    return this.http.post<Patient>(this.addpatient,newPatient)
  }

  getPatientsDetails()
{
  return this.http.get<Patient[]>(this.patientsDetails)
}
  updatePatientDetails(id: string, updatedPatient: Patient) {
    return this.http.put<Patient>(this.updatepatient +`${id}`, updatedPatient);
  }

  deletePatient(id: string)  {
    return this.http.delete(this.deletepatientData+`${id}`);
  }


  // Appointment API Call

  addAppointment(newAppointment:Appointment){
    
    return this.http.post<Appointment>(this.addbooking,newAppointment)
  }
 getBookingDetails()
{
  return this.http.get<Appointment[]>(this.getbooking)
}

editBooking(id: string, updatedAppointments: Appointment) {
   
  return this.http.put<Appointment>(this.editbooking+`${id}`, updatedAppointments);
}

deleteAppointment(id: string)  {
  return this.http.delete(this.deletebooking+`${id}`);
}

 allBookingDetails()
{
  return this.http.get<Appointment[]>(this.allBooking)
}
  // Registration API
  registerUser(userData: User): Observable<any> {
    return this.http.post(this.registerUserUrl, userData);
  }

  registerAdmin(adminData: Admin): Observable<any> {
    return this.http.post(this.registerAdminUrl, adminData);
  }

 loginUser(email: string, password: string): Observable<any> {
  return this.http.post(this.loginUserUrl, { email, password });
}


loginAdmin(email: string, password: string): Observable<any> {
  return this.http.post(this.loginAdminUrl, { email, password });
}

isLoggedIn(): boolean {
  return localStorage.getItem('isLoggedIn') === 'true';
}

getUserRole(): string | null {
  return localStorage.getItem('role');
}


updateAppointmentStatus(id: string, status: string) {
  return this.http.put(`http://localhost:3000/appointments/updateStatus/${id}`, { status });
}


getNotifications(): Observable<any> {
  const token = localStorage.getItem('token'); // Assuming you store JWT token in localStorage

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<{ notifications: [] }>(
    'http://localhost:3000/user/notifications',
    { headers }
  );
}
 adminDeleteAppointment(id: string): Observable<any> {
    return this.http.delete(this.appDelAdmin+`${id}`);
  }

}


