"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import React from "react";

interface AddFriendFormProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
}

export default function AddFriendForm({
  value,
  onChange,
  onSubmit,
  loading,
}: AddFriendFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 p-4 border rounded shadow bg-white dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold mb-4">Add a Friend</h2>
      <div className="flex gap-2 items-center">
        <Label htmlFor="friend-email" className="sr-only">
          Friend's email
        </Label>
        <Input
          id="friend-email"
          type="email"
          value={value}
          onChange={onChange}
          placeholder="Enter friend's email"
          aria-label="Friend's email"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
        </Button>
      </div>
    </form>
  );
}
