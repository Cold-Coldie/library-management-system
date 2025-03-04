import { apiInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Query key
export const BOOKS_QUERY_KEY = ["books"];

export const useGetBooks = () => {
  return useQuery({
    queryKey: BOOKS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiInstance.get("/books");
      return response.data;
    },
  });
};
