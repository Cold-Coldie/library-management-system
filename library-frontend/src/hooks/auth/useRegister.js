import { apiInstance } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiInstance.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      toast.success("Registration successful!");
    },
    onError: (error) => {
      console.error("Registration failed:", error.message);
      toast.error(error.message);
    },
  });
};
