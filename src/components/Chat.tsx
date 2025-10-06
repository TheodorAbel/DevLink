"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ensureConversation, getMessages, sendMessage } from "@/lib/chat";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

type ChatProps = {
  title?: string;
  participantId: string;
  jobId?: string;
  applicationId?: string;
  className?: string;
  pollMs?: number;
};

export function Chat({ title = "Messages", participantId, jobId, applicationId, className, pollMs = 5000 }: ChatProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; sender_user_id: string; content: string; created_at: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const pollRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !!conversationId, [input, conversationId]);

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!conversationId) return;
    try {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      // Auto scroll on refresh
      setTimeout(scrollToBottom, 0);
    } catch {
      // ignore transient
    }
  }, [conversationId, scrollToBottom]);

  useEffect(() => {
    setLoading(true);
    ensureConversation({ participantId, jobId, applicationId })
      .then((id) => {
        setConversationId(id);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to open conversation");
      })
      .finally(() => setLoading(false));
  }, [participantId, jobId, applicationId]);

  useEffect(() => {
    if (!conversationId) return;
    // initial fetch
    refresh();
    // poll
    if (pollRef.current) {
      clearInterval(pollRef.current);
    }
    pollRef.current = window.setInterval(() => {
      refresh();
    }, pollMs) as unknown as number;
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [conversationId, refresh, pollMs]);

  const onSend = async () => {
    if (!canSend || !conversationId) return;
    const text = input.trim();
    setSending(true);
    try {
      await sendMessage(conversationId, text);
      setInput("");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[420px]">
        <div ref={listRef} className="flex-1 overflow-auto space-y-3 pr-1">
          {loading && <div className="text-sm text-muted-foreground">Loading conversation…</div>}
          {!loading && messages.length === 0 && (
            <div className="text-sm text-muted-foreground">No messages yet. Say hello!</div>
          )}
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
              <div className="rounded-md border p-2 text-sm bg-card">
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex gap-2">
          <Input
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <Button onClick={onSend} disabled={!canSend || sending}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
