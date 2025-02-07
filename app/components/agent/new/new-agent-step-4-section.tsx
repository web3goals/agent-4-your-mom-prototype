"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useError from "@/hooks/use-error";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, BookUser, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function NewAgentStep4Section(props: {
  newAgentRequestData: NewAgentRequestData;
  onNewAgentRequestDataUpdate: (
    newAgentRequestData: NewAgentRequestData
  ) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    addressBook: z.string().min(3),
  });

  // TODO: Delete default values for production
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressBook: [
        "Alice, 0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1",
        "Bob, 0x3F121f9a16bd6C83D325985417aDA3FE0f517B7D",
      ].join("\n"),
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);
      props.onNewAgentRequestDataUpdate({
        ...props.newAgentRequestData,
        addressBook: values.addressBook.split("\n").map((element) => ({
          name: element.split(",")[0],
          address: element.split(",")[1],
        })),
      });
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container py-6 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <BookUser className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Step #4
      </h1>
      <p className="text-muted-foreground mt-1">
        Fill the address book with the addresses of persons or organizations to
        whom the agent is authorized to send funds
      </p>
      <Separator className="my-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="addressBook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address book *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      "Alice, 0x0000000000000000000000000000000000000000\nBob, 0x0000000000000000000000000000000000000000"
                    }
                    disabled={isProsessing}
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="default" disabled={isProsessing}>
            {isProsessing ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowRightIcon />
            )}
            Next step
          </Button>
        </form>
      </Form>
    </main>
  );
}
