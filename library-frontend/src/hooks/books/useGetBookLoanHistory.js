import { apiInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Query key generator function
export const BOOK_LOANS_QUERY_KEY = (id) => ["books", id, "loans"];

export const useGetBookLoanHistory = (id) => {
  return useQuery({
    queryKey: BOOK_LOANS_QUERY_KEY(id),
    queryFn: async () => {
      const response = await apiInstance.get(`/books/${id}/loans`);
      return response.data;
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};
