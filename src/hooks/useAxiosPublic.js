import axios from 'axios';

const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL: 'http://localhost:5001',
    withCredentials: true
  });

  return axiosPublic;
};

export default useAxiosPublic; 