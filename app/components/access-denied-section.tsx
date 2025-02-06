import { CircleOff } from "lucide-react";
import { Separator } from "./ui/separator";

export function AccessDeniedSection() {
  return (
    <main className="container py-6 lg:px-80">
      <div>
        <div className="flex items-center justify-center size-24 rounded-full bg-primary">
          <CircleOff className="size-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
          Access denied
        </h1>
        <p className="text-muted-foreground mt-1">
          Are you logged in with a correct account?
        </p>
        <Separator className="my-8" />
      </div>
    </main>
  );
}
