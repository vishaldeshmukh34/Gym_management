import API from './axiosConfig';

export const addExercise = (data) => API.post('/workout/exercise/add', data);
export const getAllExercises = () => API.get('/workout/exercises');
export const getExercisesByCategory = (category) => API.get(`/workout/exercises/${category}`);
export const createWorkoutPlan = (data) => API.post('/workout/plan/create', data);
export const getUserWorkoutPlans = (userId) => API.get(`/workout/user/${userId}`);
export const getPlansByGoal = (goal) => API.get(`/workout/goal/${goal}`);
export const deleteWorkoutPlan = (planId) => API.delete(`/workout/plan/delete/${planId}`);