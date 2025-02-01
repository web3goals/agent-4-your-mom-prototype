import { useToast } from "@/hooks/use-toast";
import { errorToString } from "@/lib/converters";

/**
 * Hook to handle errors.
 */
export default function useError() {
  const { toast } = useToast();

  const handleError = async (
    error: unknown,
    message?: string,
    disableToast?: boolean
  ) => {
    // Print error
    console.error(errorToString(error));
    // Display toast
    if (!disableToast) {
      toast({
        variant: "destructive",
        title: "Something went wrong :(",
        description: message || errorToString(error),
      });
    }
  };

  return {
    handleError,
  };
}
