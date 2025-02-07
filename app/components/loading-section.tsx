import { Loader2Icon } from "lucide-react";

export function LoadingSection() {
  return (
    <main className="container py-16 lg:px-80">
      <div className="flex flex-col items-center">
        <Loader2Icon className="animate-spin text-primary" />
      </div>
    </main>
  );
}
