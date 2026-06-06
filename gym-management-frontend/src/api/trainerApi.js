import API from './axiosConfig';

export const addTrainer = (data) => API.post('/trainer/add', data);
export const getAllTrainers = () => API.get('/trainer/all');
export const getActiveTrainers = () => API.get('/admin/trainers/active'); // ← हे add केलं
export const getTrainersBySpecialization = (spec) => API.get(`/trainer/specialization/${spec}`);
export const assignTrainerToUser = (trainerId, userId) => API.post(`/trainer/assign/${trainerId}/${userId}`);
export const getUserTrainer = (userId) => API.get(`/trainer/user/${userId}`);
export const getTrainerClients = (trainerId) => API.get(`/trainer/clients/${trainerId}`);
export const deactivateTrainer = (trainerId) => API.put(`/trainer/deactivate/${trainerId}`);
export const completeAssignment = (assignmentId) => API.put(`/trainer/complete/${assignmentId}`);