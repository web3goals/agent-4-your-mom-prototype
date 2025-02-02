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
import { Skeleton } from "@/components/ui/skeleton";
import useError from "@/hooks/use-error";
import { Agent } from "@/mongodb/models/agent";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIMessage,
  HumanMessage,
  StoredMessage,
} from "@langchain/core/messages";
import axios from "axios";
import { BotIcon, Loader2Icon, SendIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// TODO: Implement
export default function AgentPage() {
  const { id } = useParams();
  const { handleError } = useError();
  const [agent, setAgent] = useState<Agent | undefined>();
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
      if (!agent) {
        throw new Error("Agent undefined");
      }
      // Save user message
      const newAgent = agent;
      newAgent.messages.push(
        new HumanMessage({ content: values.message }).toDict()
      );
      setAgent(newAgent);
      // Send user messages to agent
      // TODO: Use email address from Privy
      const { data } = await axios.post(
        `/api/agents/${id}/messages`,
        { message: values.message },
        { headers: { Authorization: "test@test.test" } }
      );
      // Save agent response message
      newAgent.messages.push(new AIMessage({ content: data.data }).toDict());
      setAgent(newAgent);
      form.reset();
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  useEffect(() => {
    setAgent(undefined);
    // TODO: Use email address from Privy
    axios
      .get(`/api/agents/${id}`, {
        headers: { Authorization: "test@test.test" },
      })
      .then(({ data }) => {
        setAgent(data.data);
      })
      .catch((error) =>
        handleError(error, "Failed to load agent, try again later")
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main className="container py-6 lg:px-80">
      <div className="flex items-center justify-center size-16 rounded-full bg-primary">
        <BotIcon className="text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tighter mt-2">
        Agent #{id}
      </h1>
      <Separator className="my-4" />
      {agent ? (
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
          <EntityList<StoredMessage>
            entities={agent.messages?.toReversed()}
            renderEntityCard={(message, index) => (
              <MessageCard key={index} message={message} />
            )}
            noEntitiesText="No messages here yet..."
          />
        </div>
      ) : (
        <Skeleton className="h-8" />
      )}
    </main>
  );
}

function MessageCard(props: { message: StoredMessage }) {
  return (
    <div className="w-full border rounded px-4 py-6">
      <p className="text-sm">{JSON.stringify(props.message, null, 2)}</p>
    </div>
  );
}
