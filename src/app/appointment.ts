export interface Appointment {
    _id?: string;
    name: string;
    age: number;
    doctor: string;
    date: Date;
    time: string;
    phone: number;
    email: string;
    notes?: string;
    status?: string;
    originalStatus?:string
    // user?:string
}
