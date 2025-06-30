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

doctors = 'https://medihubserver.onrender.com/doctors/getall';
adddoctor='https://medihubserver.onrender.com/doctors/add'
editdoctor='https://medihubserver.onrender.com/doctors/edit/'
deletedoctor='https://medihubserver.onrender.com/doctors/delete/';

addpatient='https://medihubserver.onrender.com/patients/addpatient'
patientsDetails = 'https://medihubserver.onrender.com/patients/getPatients';
updatepatient='https://medihubserver.onrender.com/patients/updatedPatientsDetails/'
deletepatientData='https://medihubserver.onrender.com/patients/deletePatientDetails/'


addbooking='https://medihubserver.onrender.com/appointments/bookappointment'
getbooking='https://medihubserver.onrender.com/appointments/appointmentDetails'
editbooking='https://medihubserver.onrender.com/appointments/editAppointment/'
deletebooking='https://medihubserver.onrender.com/appointments/deleteAppointment/'
allBooking='https://medihubserver.onrender.com/appointments/allAppointmentDetails'


 registerUserUrl = 'https://medihubserver.onrender.com/user/registerUser';
 loginUserUrl = 'https://medihubserver.onrender.com/user/loginUser';

    registerAdminUrl = 'https://medihubserver.onrender.com/admin/registerAdmin';
loginAdminUrl = 'https://medihubserver.onrender.com/admin/loginAdmin';
appDelAdmin='https://medihubserver.onrender.com/admin/deleteAppointment/'

 getUserUrl = 'https://medihubserver.onrender.com/user/getallusers';
CancelledAppointents='https://medihubserver.onrender.com/user/cancelledAppointments'
ApprovedAppointments='https://medihubserver.onrender.com/user/approvedAppointments'

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
  return this.http.put(`https://medihubserver.onrender.com/appointments/updateStatus/${id}`, { status });
}



getNotifications(): Observable<any> {
  const token = localStorage.getItem('token'); // Assuming you store JWT token in localStorage

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<{ notifications: [] }>(
    'https://medihubserver.onrender.com/user/notifications',
    { headers }
  );
}
 adminDeleteAppointment(id: string): Observable<any> {
    return this.http.delete(this.appDelAdmin+`${id}`);
  }

 getUsers() {
    return this.http.get<User[]>(this.getUserUrl)

  } 
getApprovedAppointments(): Observable<any> {
  const token = localStorage.getItem('token'); // retrieve JWT from localStorage

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<{ ApprovedAppointments: Appointment[] }>(
    this.ApprovedAppointments,
    { headers }
  );
}
getCancelledAppointments(): Observable<{ CancelledAppointments: Appointment[] }> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<{ CancelledAppointments: Appointment[] }>(
    this.CancelledAppointents, // make sure this points to the correct URL
    { headers }
  );
}
getUserDeletedAppointments(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(this.appointmentDeleteByUser, { headers });
}
}


