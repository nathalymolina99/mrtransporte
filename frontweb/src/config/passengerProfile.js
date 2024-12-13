import axios from './axios';

export const getProfileRequest = async () => axios.get('/passenger/profile');

export const updateProfileRequest = async (profileData) => axios.put('/passenger/profile', profileData);

export const changePasswordRequest = async (passwordData) => axios.put('/passenger/password', passwordData);
