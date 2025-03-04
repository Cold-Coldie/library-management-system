import { apiInstance } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BOOKS_QUERY_KEY } from "./useGetBooks";

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookData) => {
      const response = await apiInstance.post("/books", bookData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the books query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY });
      toast.success("Book created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create book:", error.message);
      toast.error(error.response?.data?.message || "Failed to create book");
    },
  });
};
