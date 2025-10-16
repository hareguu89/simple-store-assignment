import { useCompanyInfo } from "@/queries/useCompanyInfo";

const HomeContainer = () => {
  const { data: companyInfo, isLoading, error } = useCompanyInfo();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !companyInfo) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load company information
      </div>
    );
  }

  return <div className="max-w-4xl mx-auto p-4"></div>;
};

export default HomeContainer;
