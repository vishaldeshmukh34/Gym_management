import API from './axiosConfig';

export const createDietPlan = (data) => API.post('/diet/create', data);
export const getUserDietPlans = (userId) => API.get(`/diet/user/${userId}`);
export const getPlansByGoal = (goal) => API.get(`/diet/goal/${goal}`);
export const getMealsByPlan = (planId) => API.get(`/diet/meals/${planId}`);
export const markMealCompleted = (mealId) => API.put(`/diet/meal/complete/${mealId}`);
export const deleteDietPlan = (planId) => API.delete(`/diet/delete/${planId}`);