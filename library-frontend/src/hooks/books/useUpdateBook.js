import { apiInstance } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BOOKS_QUERY_KEY } from "./useGetBooks";
import { BOOK_DETAIL_QUERY_KEY } from "./useGetBookById";

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...bookData }) => {
      const response = await apiInstance.put(`/books/${id}`, bookData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific book detail
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: BOOK_DETAIL_QUERY_KEY(variables.id),
      });
      toast.success("Book updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update book:", error.message);
      toast.error(error.response?.data?.message || "Failed to update book");
    },
  });
};
