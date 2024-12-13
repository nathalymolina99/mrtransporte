import axios from './axios';

export const getAssignedDriverRequest = async () => axios.get('/passenger/assigned-driver');
