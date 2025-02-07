"use client";

import EntityList from "@/components/entity-list";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useError from "@/hooks/use-error";
import { Agent } from "@/mongodb/models/agent";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoredMessage } from "@langchain/core/messages";
import axios from "axios";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "../ui/separator";
import { AgentMessageCard } from "./agent-message-card";
import { usePrivy } from "@privy-io/react-auth";
import { privyUserToEmail } from "@/lib/converters";

export function AgentSection(props: {
  agent: Agent;
  onAgentUpdate: (agent: Agent) => void;
}) {
  const { user } = usePrivy();
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    message: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);
      if (!user) {
        throw new Error("User not defined");
      }
      const { data } = await axios.post(
        `/api/agents/${props.agent._id}/messages`,
        { message: values.message },
        { headers: { Authorization: `Bearer ${privyUserToEmail(user)}` } }
      );
      props.onAgentUpdate({ ...props.agent, messages: data.data });
      form.reset();
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container py-6 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <p className="text-4xl">{props.agent.personality.emoji}</p>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        {props.agent.personality.name}
      </h1>
      <p className="text-muted-foreground mt-1">
        I am your personal AI agent who will help you venture into the crypto
        world
      </p>
      <Separator className="my-8" />
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-row gap-2"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Your message..."
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
                <SendIcon />
              )}
            </Button>
          </form>
        </Form>
        <EntityList<StoredMessage>
          entities={props.agent.messages?.toReversed()}
          renderEntityCard={(message, index) => (
            <AgentMessageCard
              key={index}
              agent={props.agent}
              message={message}
            />
          )}
          noEntitiesText="No messages here yet..."
        />
      </div>
    </main>
  );
}
