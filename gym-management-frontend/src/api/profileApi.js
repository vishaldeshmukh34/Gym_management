import API from './axiosConfig';

export const saveProfile = (data) => API.post('/profile/save', data);
export const getProfile = (userId) => API.get(`/profile/${userId}`);




