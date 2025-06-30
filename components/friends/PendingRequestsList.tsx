"use client";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import React from "react";

interface PendingRequest {
  id: string;
  user: { id: string; email: string };
}

interface PendingRequestsListProps {
  requests: PendingRequest[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  loading?: boolean;
}

export default function PendingRequestsList({
  requests,
  onAccept,
  onDecline,
  loading,
}: PendingRequestsListProps) {
  return (
    <div className="mb-8 p-4 border rounded shadow bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests && requests.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {requests.map((req) => (
            <li
              key={req.id}
              className="flex justify-between items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-3">
                <Avatar emailOrName={req.user.email} size={36} />
                <span className="text-gray-800 dark:text-gray-200">
                  {req.user.email} wants to be your friend.
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={() => onAccept(req.id)}>
                  Accept
                </Button>
                <Button variant="danger" onClick={() => onDecline(req.id)}>
                  Decline
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 text-center py-4">
          No pending friend requests. You're all caught up!
        </div>
      )}
    </div>
  );
}
