import axios from 'axios';

const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL: 'https://task-server-orcin.vercel.app',
    withCredentials: true
  });

  return axiosPublic;
};

export default useAxiosPublic; 