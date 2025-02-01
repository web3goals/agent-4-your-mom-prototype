"use client";

import EntityList from "@/components/entity-list";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import axios from "axios";
import { BotIcon, Loader2Icon, SendIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// TODO: Implement
export default function AgentPage() {
  const { id } = useParams();
  const { handleError } = useError();
  const [messages, setMessages] = useState<BaseMessage[] | undefined>([
    new SystemMessage({
      content:
        "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit.",
    }),
  ]);
  const [isProsessing, setIsProsessing] = useState(false);

  const formSchema = z.object({
    message: z.string().min(3),
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
      // Save user message
      const newMessages = messages || [];
      newMessages.push(new HumanMessage({ content: values.message }));
      setMessages(newMessages);
      // Send user messages to agent
      const { data } = await axios.post("/api/agent", {
        messages: newMessages,
      });
      // Save agent message
      newMessages.push(new AIMessage({ content: data.data }));
      setMessages(newMessages);
      form.reset();
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container py-6 lg:px-80">
      <div className="flex items-center justify-center size-16 rounded-full bg-primary">
        <BotIcon className="text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tighter mt-2">
        Agent #{id}
      </h1>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
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
              Send
            </Button>
          </form>
        </Form>
        <EntityList<BaseMessage>
          entities={messages?.toReversed()}
          renderEntityCard={(message, index) => (
            <MessageCard key={index} message={message} />
          )}
          noEntitiesText="No messages here yet..."
        />
      </div>
    </main>
  );
}

function MessageCard(props: { message: BaseMessage }) {
  return (
    <div className="w-full border rounded px-4 py-6">
      <p className="text-sm">{JSON.stringify(props.message, null, 2)}</p>
    </div>
  );
}
