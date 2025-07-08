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

  // Actionable: Go to related entity (stub, to be implemented in dashboard revamp)
  function handleView(n: any) {
    toast("Navigation to related entity coming soon!", { icon: "🚀" });
  }

  return (
    <div className="w-full max-w-md" role="dialog" aria-modal="true" tabIndex={-1}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <Button variant="secondary" onClick={onClose} aria-label="Close notifications">Close</Button>
      </div>
      <div className="mb-2 flex justify-end">
        <Button
          variant="primary"
          onClick={() => markAllAsRead.mutate()}
          disabled={markAllAsRead.status === "loading"}
          style={{ cursor: markAllAsRead.status === "loading" ? "wait" : "pointer" }}
        >
          {markAllAsRead.status === "loading" ? <Spinner className="w-4 h-4 mr-2" /> : "Mark all as read"}
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner className="w-6 h-6" /></div>
        ) : notifications && notifications.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-3 py-3 px-2 rounded transition-colors fade-in ${!n.isRead ? "bg-primary-50 dark:bg-primary-900 animate-fade-in" : ""}`}
                style={{ cursor: !n.isRead ? "pointer" : "default" }}
                tabIndex={0}
                aria-label={n.message}
                onClick={() => !n.isRead && markAsRead.mutate({ notificationId: n.id })}
              >
                <div className="flex items-center pt-1">{getNotificationIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{n.message}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.type.replace(/_/g, " ")}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.isRead && (
                  <Button
                    variant="secondary"
                    onClick={(e) => { e.stopPropagation(); markAsRead.mutate({ notificationId: n.id }); }}
                    style={{ cursor: markAsRead.status === "loading" ? "wait" : "pointer", fontSize: "0.875rem", padding: "0.25rem 0.75rem" }}
                    aria-label="Mark as read"
                  >
                    Mark as read
                  </Button>
                )}
                {/* Actionable: View button for friend request/cheer */}
                {n.relatedEntityId && (
                  <Button
                    variant="primary"
                    onClick={(e) => { e.stopPropagation(); handleView(n); }}
                    style={{ fontSize: "0.875rem", padding: "0.25rem 0.75rem" }}
                    aria-label="View related"
                  >
                    View
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <PartyPopper className="w-12 h-12 mb-2 text-primary-400" />
            <div className="text-lg font-medium mb-1">No notifications yet.</div>
            <div className="text-base">You’re all caught up! 🎉</div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
} 