import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/axios";

interface CompanyInfo {
  name: string;
  description: string;
  employees: number;
  location: string;
}

const fetchCompanyInfo = async (): Promise<CompanyInfo> => {
  return apiClient.get("/company");
};

export const useCompanyInfo = () => {
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: fetchCompanyInfo,
  });
};
