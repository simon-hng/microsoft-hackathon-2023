"use client"

import { Button } from "@/components/ui/button";
import { Chat, Envelope, Robot } from "@phosphor-icons/react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="h-screen flex-col flex items-center justify-center gap-3">
      <Robot className="h-24 w-24" />
      <h1 className="text-4xl font-bold">Welcome to TUM Support GPT Bot</h1>
      <p className="text-xl text-gray-500">We're here to help you with your AI needs</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="chat">
            <Chat className="w-6 h-6 mr-2"/>Start chatting
          </Link>
        </Button>

        <Button asChild>
          <Link href="dashboard">
              <Envelope className="w-6 h-6 mr-2"/>See dashboard
          </Link>
        </Button>
      </div>
    </section>
  );
}
