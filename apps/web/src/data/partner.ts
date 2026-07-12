export const currentHotelPartner = {
  hotelName: "Beijing Riverside Suites",
  contactName: "Wei Chen",
};

export type RoomType = {
  id: string;
  name: string;
  count: number;
  baseRateUsd: number;
};

export const roomTypes: RoomType[] = [
  { id: "rt-1", name: "Standard Queen", count: 12, baseRateUsd: 95 },
  { id: "rt-2", name: "Deluxe King", count: 8, baseRateUsd: 120 },
  { id: "rt-3", name: "Suite (2-room)", count: 4, baseRateUsd: 210 },
];

export type HotelBooking = {
  id: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: "Pending" | "Confirmed" | "Rejected";
};

export const hotelBookings: HotelBooking[] = [
  { id: "hb-1", guestName: "Amara Nwosu", roomType: "Deluxe King", checkIn: "2026-07-26", checkOut: "2026-07-31", status: "Pending" },
  { id: "hb-2", guestName: "Farrukh Tashkentov", roomType: "Standard Queen", checkIn: "2026-07-20", checkOut: "2026-07-24", status: "Confirmed" },
  { id: "hb-3", guestName: "Grace Otieno", roomType: "Standard Queen", checkIn: "2026-06-15", checkOut: "2026-06-17", status: "Confirmed" },
];

export const currentDriver = { name: "Zhang Wei" };

export type DriverTrip = {
  id: string;
  time: string;
  direction: "Arrival" | "Departure";
  patientName: string;
  flightNumber: string;
  pickupLocation: string;
  date: string;
  status: "Upcoming" | "Completed";
};

export const driverTrips: DriverTrip[] = [
  {
    id: "trip-1",
    time: "14:20",
    direction: "Arrival",
    patientName: "Amara Nwosu",
    flightNumber: "CA987",
    pickupLocation: "Beijing Capital Intl (PEK), Terminal 3",
    date: "2026-07-28",
    status: "Upcoming",
  },
  {
    id: "trip-2",
    time: "09:00",
    direction: "Departure",
    patientName: "Michael Asante",
    flightNumber: "ET687",
    pickupLocation: "Beijing Riverside Suites",
    date: "2026-07-30",
    status: "Upcoming",
  },
  {
    id: "trip-3",
    time: "16:45",
    direction: "Arrival",
    patientName: "Amara Nwosu",
    flightNumber: "CA981",
    pickupLocation: "Beijing Capital Intl (PEK), Terminal 3",
    date: "2026-02-02",
    status: "Completed",
  },
];

export const currentInterpreter = { name: "Sun Li", languages: "English / Mandarin" };

export type InterpreterAppointment = {
  id: string;
  time: string;
  patientName: string;
  hospitalName: string;
  department: string;
  date: string;
  note: string;
  status: "Upcoming" | "Completed";
};

export const interpreterAppointments: InterpreterAppointment[] = [
  {
    id: "int-1",
    time: "09:30",
    patientName: "Amara Nwosu",
    hospitalName: "Beijing United Family Hospital",
    department: "Cardiology — Pre-op diagnostics",
    date: "2026-07-28",
    note: "Patient uses a wheelchair — meet at main lobby.",
    status: "Upcoming",
  },
  {
    id: "int-2",
    time: "11:00",
    patientName: "Farrukh Tashkentov",
    hospitalName: "Beijing United Family Hospital",
    department: "Cardiology — Initial consultation",
    date: "2026-07-21",
    note: "",
    status: "Upcoming",
  },
];
