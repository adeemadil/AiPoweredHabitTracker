"use client";
import { trpc } from "@/lib/trpc/init";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { UserPlus, CheckCircle, XCircle, PartyPopper } from "lucide-react";

function getNotificationIcon(type: string) {
  switch (type) {
    case "FRIEND_REQUEST":
      return <UserPlus className="w-5 h-5 text-primary-600 mr-2" />;
    case "REQUEST_ACCEPTED":
      return <CheckCircle className="w-5 h-5 text-green-600 mr-2" />;
    case "REQUEST_DECLINED":
      return <XCircle className="w-5 h-5 text-red-500 mr-2" />;
    case "NEW_CHEER":
      return <PartyPopper className="w-5 h-5 text-yellow-500 mr-2" />;
    default:
      return null;
  }
}

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const utils = trpc.useUtils();
  const { data: notifications, isLoading } = trpc.notifications.list.useQuery();
  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
    onError: () => toast.error("Failed to mark as read"),
  });
  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
    onError: () => toast.error("Failed to mark all as read"),
  });

  function handleView(n: any) {
    toast("Navigation to related entity coming soon!", { icon: "🚀" });
  }

  return (
    <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl px-8 py-8" role="dialog" aria-modal="true" tabIndex={-1} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-left" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>Notifications</h2>
        <button
          className="ml-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="Close notifications"
          style={{ cursor: "pointer" }}
        >
          ×
        </button>
      </div>
      <div className="mb-4 flex justify-end">
        <Button
          variant="primary"
          onClick={() => markAllAsRead.mutate()}
          disabled={markAllAsRead.status === "loading"}
          className="rounded-full px-5 py-2 text-base font-semibold shadow-sm"
          style={{ cursor: markAllAsRead.status === "loading" ? "wait" : "pointer", fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {markAllAsRead.status === "loading" ? <Spinner className="w-4 h-4 mr-2" /> : "Mark all as read"}
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner className="w-6 h-6" /></div>
        ) : notifications && notifications.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl shadow bg-white dark:bg-gray-900 ${!n.isRead ? "border-l-4 border-blue-400" : ""}`}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: n.isRead ? 400 : 700 }}
                tabIndex={0}
                aria-label={n.message}
              >
                {/* Icon */}
                <div className="flex items-center pt-1">{getNotificationIcon(n.type)}</div>
                {/* Message and timestamp */}
                <div className="flex-1 min-w-0">
                  <div className={`truncate ${!n.isRead ? "text-primary-700 dark:text-primary-200" : "text-gray-900 dark:text-gray-100"}`}>{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {/* Unread blue dot */}
                {!n.isRead && <span className="w-3 h-3 rounded-full bg-blue-500 mr-2" aria-label="Unread notification"></span>}
                {/* Mark as read button */}
                {!n.isRead && (
                  <Button
                    variant="secondary"
                    onClick={() => markAsRead.mutate({ notificationId: n.id })}
                    className="rounded-full px-4 py-1 text-sm font-semibold ml-2"
                    style={{ cursor: markAsRead.status === "loading" ? "wait" : "pointer", fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    aria-label="Mark as read"
                  >
                    Mark as read
                  </Button>
                )}
                {/* View button for actionable notifications */}
                {n.relatedEntityId && (
                  <Button
                    variant="primary"
                    onClick={() => handleView(n)}
                    className="rounded-full px-4 py-1 text-sm font-semibold ml-2"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    aria-label="View related"
                  >
                    View
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg width="72" height="72" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="mb-4">
              <rect x="8" y="16" width="48" height="32" rx="12" fill="#bae6fd" />
              <circle cx="32" cy="32" r="12" fill="#38bdf8" />
              <ellipse cx="32" cy="48" rx="10" ry="3" fill="#0284c7" opacity="0.15" />
            </svg>
            <div className="text-lg font-medium mb-1">All caught up!</div>
            <div className="text-base">You’ve read all your notifications. Check back later for updates.</div>
          </div>
        )}
      </div>
    </div>
  );
} 