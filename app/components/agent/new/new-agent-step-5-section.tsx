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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/use-error";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Loader2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function NewAgentStep5Section(props: {
  newAgentRequestData: NewAgentRequestData;
  onNewAgentRequestDataUpdate: (
    newAgentRequestData: NewAgentRequestData
  ) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    apiKey: z.string().min(1),
    apiSecret: z.string().min(1),
    accessToken: z.string().min(1),
    accessTokenSecret: z.string().min(1),
  });

  // TODO: Delete default values for production
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "UNKNOWN",
      apiSecret: "UNKNOWN",
      accessToken: "UNKNOWN",
      accessTokenSecret: "UNKNOWN",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);
      props.onNewAgentRequestDataUpdate({
        ...props.newAgentRequestData,
        twitter: {
          apiKey: values.apiKey,
          apiSecret: values.apiSecret,
          accessToken: values.accessToken,
          accessTokenSecret: values.accessTokenSecret,
        },
      });
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  async function handleSkip() {
    try {
      setIsProsessing(true);
      props.onNewAgentRequestDataUpdate({
        ...props.newAgentRequestData,
        twitter: {
          apiKey: "",
          apiSecret: "",
          accessToken: "",
          accessTokenSecret: "",
        },
      });
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container py-16 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <XIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Step #5
      </h1>
      <p className="text-muted-foreground mt-1">
        Fill in X credentials to allow the agent to post to X, or skip this step
      </p>
      <Separator className="my-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API key *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="az..."
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apiSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API secret *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="az..."
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accessToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access token *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="az..."
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accessTokenSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access token secret *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="az..."
                    disabled={isProsessing}
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
      <Button
        variant="outline"
        disabled={isProsessing}
        onClick={() => handleSkip()}
        className="mt-2"
      >
        {isProsessing ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <ArrowRightIcon />
        )}
        Skip
      </Button>
    </main>
  );
}
