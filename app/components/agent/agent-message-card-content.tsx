"use client";

import ReactMarkdown from "react-markdown";

export function AgentMessageCardContent(props: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => {
          return (
            <p className="text-sm [&:not(:first-child)]:mt-4">{children}</p>
          );
        },
        a: ({ href, children }) => {
          return (
            <a
              href={href}
              target="_blank"
              className="underline underline-offset-4"
            >
              {children}
            </a>
          );
        },
        ul: ({ children }) => {
          return (
            <ul className="text-sm [&:not(:first-child)]:mt-4">{children}</ul>
          );
        },
        ol: ({ children }) => {
          return (
            <ol className="text-sm [&:not(:first-child)]:mt-4">{children}</ol>
          );
        },
        li: ({ children }) => {
          return <li className="[&:not(:first-child)]:mt-4">{children}</li>;
        },
      }}
    >
      {props.content}
    </ReactMarkdown>
  );
}
