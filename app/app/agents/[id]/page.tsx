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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useError from "@/hooks/use-error";
import { Agent } from "@/mongodb/models/agent";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoredMessage } from "@langchain/core/messages";
import axios from "axios";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// TODO: Implement
export default function AgentPage() {
  const { id } = useParams();
  const { handleError } = useError();
  const [agent, setAgent] = useState<Agent | undefined>();

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
      {agent ? (
        <>
          <AgentHeader agent={agent} />
          <Separator className="my-8" />
          <AgentChat agent={agent} onAgentUpdate={(agent) => setAgent(agent)} />
        </>
      ) : (
        <Skeleton className="h-8" />
      )}
    </main>
  );
}

function AgentHeader(props: { agent: Agent }) {
  return (
    <div>
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <p className="text-4xl">{props.agent.emoji}</p>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        {props.agent.name}
      </h1>
      <p className="text-muted-foreground mt-1">{props.agent.description}</p>
    </div>
  );
}

function AgentChat(props: {
  agent: Agent;
  onAgentUpdate: (agent: Agent) => void;
}) {
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
      // TODO: Use email address from Privy
      const { data } = await axios.post(
        `/api/agents/${props.agent._id}/messages`,
        { message: values.message },
        { headers: { Authorization: "test@test.test" } }
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
          <AgentMessageCard key={index} agent={props.agent} message={message} />
        )}
        noEntitiesText="No messages here yet..."
      />
    </div>
  );
}

function AgentMessageCard(props: { agent: Agent; message: StoredMessage }) {
  if (props.message.type === "ai" && props.message.data.content) {
    return (
      <div className="w-full flex flex-row gap-2">
        <div className="flex items-center justify-center size-8 bg-primary rounded-full">
          <p>{props.agent.emoji}</p>
        </div>
        <div className="flex-1 bg-secondary border rounded-lg px-4 py-3">
          <p className="text-sm">{props.message.data.content}</p>
        </div>
      </div>
    );
  }

  if (props.message.type === "human" && props.message.data.content) {
    return (
      <div className="flex-1 border rounded-lg px-4 py-3">
        <p className="text-sm">{props.message.data.content}</p>
      </div>
    );
  }

  // TODO: Don't show this message on production
  return (
    <div className="w-full border rounded-lg px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {JSON.stringify(props.message, null, 2)}
      </p>
    </div>
  );
}
