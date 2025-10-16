import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/axios";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
}

const fetchJobs = async (): Promise<Job[]> => {
  return apiClient.get("/jobs");
};

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });
};
