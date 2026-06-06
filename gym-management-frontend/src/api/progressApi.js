import API from './axiosConfig';

export const saveProgress = (data) => API.post('/progress/save', data);
export const getTodayProgress = (userId) => API.get(`/progress/today/${userId}`);
export const getWeeklyProgress = (userId) => API.get(`/progress/weekly/${userId}`);
export const getMonthlyProgress = (userId) => API.get(`/progress/monthly/${userId}`);
export const getTotalWorkoutDays = (userId) => API.get(`/progress/workoutdays/${userId}`);

export const getAllProgress = (userId) => API.get(`/progress/user/${userId}`);