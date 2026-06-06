import API from './axiosConfig';

export const generateQR = (userId) => API.get(`/attendance/qr/${userId}`);
export const checkIn = (qrCode) => API.post(`/attendance/checkin/${qrCode}`);
export const checkOut = (qrCode) => API.post(`/attendance/checkout/${qrCode}`);
export const getTodayAttendance = (userId) => API.get(`/attendance/today/${userId}`);
export const getTotalPresentDays = (userId) => API.get(`/attendance/total/${userId}`);