import { apiInstance } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      toast.success("Login successful!");
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      toast.error(error.message);
    },
  });
};
