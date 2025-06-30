"use client";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import React from "react";

type Cheer = {
  id: string;
  message?: string | null;
  sender: { id: string; email: string };
};

interface CheersModalProps {
  habitName: string;
  cheers: Cheer[] | undefined;
  isLoading: boolean;
  cheerMessage: string;
  setCheerMessage: (msg: string) => void;
  onSendCheer: () => void;
  onClose: () => void;
  disableSendCheer: boolean;
}

export default function CheersModal({
  habitName,
  cheers,
  isLoading,
  cheerMessage,
  setCheerMessage,
  onSendCheer,
  onClose,
  disableSendCheer,
}: CheersModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          Cheers for {habitName}
        </h3>
        {isLoading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading cheers...</p>
        ) : cheers && cheers.length > 0 ? (
          <ul className="mb-4 max-h-60 overflow-y-auto">
            {cheers.map((cheer) => (
              <li
                key={cheer.id}
                className="border-b border-gray-200 dark:border-gray-700 py-2"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {cheer.message || "Sent a cheer!"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  From: {cheer.sender.email}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            No cheers yet. Be the first!
          </p>
        )}

        <div className="mt-4">
          <Textarea
            value={cheerMessage}
            onChange={(e) => setCheerMessage(e.target.value)}
            placeholder="Write a cheer message..."
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button
              onClick={onSendCheer}
              disabled={disableSendCheer}
              className={
                disableSendCheer ? "opacity-50 cursor-not-allowed" : ""
              }
              title={
                disableSendCheer
                  ? "You can't send cheers to yourself!"
                  : "Send a cheer"
              }
            >
              Send Cheer
            </Button>
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
          {disableSendCheer && (
            <div className="text-xs text-red-500 mt-2">
              You can't send cheers to yourself.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
