import { Appointment } from "./appointment";

export interface User {
    id?: string;        
  name: string;
  email: string;
  password: string;
  role: 'user';
   createdAt?: string;  
  updatedAt?: string; 
  appointments?:Appointment[],
   approvedAppointments?: Appointment[];
  cancelledAppointments?: Appointment[];
}
