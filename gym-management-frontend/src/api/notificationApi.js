import API from './axiosConfig';

export const getUnreadNotifications = (userId) => API.get(`/notifications/unread/${userId}`);
export const getAllNotifications = (userId) => API.get(`/notifications/user/${userId}`);
export const markAsRead = (id) => API.put(`/notifications/read/${id}`);
export const markAllRead = (userId) => API.put(`/notifications/readall/${userId}`);
export const sendWorkoutReminder = (userId) => API.post(`/notifications/workout/${userId}`);
export const sendWaterReminder = (userId) => API.post(`/notifications/water/${userId}`);
export const sendDietReminder = (userId) => API.post(`/notifications/diet/${userId}`);