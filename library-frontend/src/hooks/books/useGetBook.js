import { apiInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const BOOK_DETAIL_QUERY_KEY = (id) => ["books", id];

export const useGetBookById = (id) => {
  return useQuery({
    queryKey: BOOK_DETAIL_QUERY_KEY(id),
    queryFn: async () => {
      const response = await apiInstance.get(`/books/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};
