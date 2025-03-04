import { apiInstance } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BOOKS_QUERY_KEY } from "./useGetBooks";
import { BOOK_DETAIL_QUERY_KEY } from "./useGetBookById";

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiInstance.delete(`/books/${id}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the books query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      // Remove the specific book from the query cache
      queryClient.removeQueries({ queryKey: BOOK_DETAIL_QUERY_KEY(variables) });
      toast.success("Book deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete book:", error.message);
      toast.error(error.response?.data?.message || "Failed to delete book");
    },
  });
};
