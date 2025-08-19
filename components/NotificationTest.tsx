"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Bell, Mail, Smartphone } from "lucide-react";

const notificationTypes = [
  { type: "HABIT_REMINDER", label: "Habit Reminder", icon: Bell },
  { type: "FRIEND_REQUEST", label: "Friend Request", icon: Mail },
  { type: "REQUEST_ACCEPTED", label: "Request Accepted", icon: Mail },
  { type: "NEW_CHEER", label: "New Cheer", icon: Bell },
  { type: "STREAK_MILESTONE", label: "Streak Milestone", icon: Bell },
  { type: "WEEKLY_SUMMARY", label: "Weekly Summary", icon: Bell },
] as const;

export default function NotificationTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const sendTestNotification = trpc.notifications.sendTest.useMutation({
    onSuccess: (data) => {
      setLastSent(data.type);
      setIsLoading(false);
      utils.notifications.list.invalidate();
      utils.notifications.getUnreadCount.invalidate();
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleSendTest = (type: string) => {
    setIsLoading(true);
    sendTestNotification.mutate({ type: type as any });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Smartphone className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Test Notifications
        </h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Test different notification types. Check the console for email/push notification logs.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {notificationTypes.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant="secondary"
            onClick={() => handleSendTest(type)}
            disabled={isLoading}
            className="flex items-center gap-2 py-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {lastSent && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ Test notification sent: <strong>{lastSent}</strong>
          </p>
          <p className="text-xs text-green-600 mt-1">
            Check your notifications list and browser console for details.
          </p>
        </div>
      )}
    </Card>
  );
}
