import API from './axiosConfig';

export const buyMembership = (data) => API.post('/membership/buy', data);
export const getActiveMembership = (userId) => API.get(`/membership/active/${userId}`);
export const getUserMemberships = (userId) => API.get(`/membership/user/${userId}`);
export const cancelMembership = (id) => API.put(`/membership/cancel/${id}`);
export const getAllActiveMemberships = () => API.get('/membership/all/active');
export const getAllMemberships = () => API.get('/admin/memberships');