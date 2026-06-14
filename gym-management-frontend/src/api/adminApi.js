import API from './axiosConfig';

export const getAdminDashboard = () => API.get('/admin/dashboard');
export const getAdminAllUsers = () => API.get('/admin/users');
export const deleteAdminUser = (userId) => API.delete(`/admin/users/delete/${userId}`);
export const getAdminAllTrainers = () => API.get('/admin/trainers');
export const getAdminActiveTrainers = () => API.get('/admin/trainers/active');
export const deleteAdminTrainer = (trainerId) => API.delete(`/admin/trainers/delete/${trainerId}`);
export const getAdminAllMemberships = () => API.get('/admin/memberships');
export const getAdminActiveMemberships = () => API.get('/admin/memberships/active');
export const getAdminRevenue = () => API.get('/admin/revenue');