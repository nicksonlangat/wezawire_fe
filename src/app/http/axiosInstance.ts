import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAxiosInstance = () => {
  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
    withCredentials: true, // Ensures cookies are sent with requests
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    // Add a response interceptor to handle errors
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to signin when 401 Unauthorized occurs
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor on unmount
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [router]);

  return axiosInstance;
};

export default useAxiosInstance;
