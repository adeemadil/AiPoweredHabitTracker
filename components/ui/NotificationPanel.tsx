"use client";
import { trpc } from "@/lib/trpc/init";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { UserPlus, CheckCircle, XCircle, PartyPopper, Trash2, MoreHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const deleteOptionsRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close delete options when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deleteOptionsRef.current && !deleteOptionsRef.current.contains(event.target as Node)) {
        setShowDeleteOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const { data: notifications, isLoading } = trpc.notifications.list.useQuery();
  
  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
    onError: () => toast.error("Failed to mark as read"),
  });
  
  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
    onError: () => toast.error("Failed to mark all as read"),
  });

  const deleteNotification = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.getUnreadCount.invalidate();
      toast.success("Notification deleted");
    },
    onError: () => toast.error("Failed to delete notification"),
  });

  const deleteAllRead = trpc.notifications.deleteAllRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.getUnreadCount.invalidate();
      toast.success("All read notifications deleted");
      setShowDeleteOptions(false);
    },
    onError: () => toast.error("Failed to delete notifications"),
  });

  const deleteOld = trpc.notifications.deleteOld.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.getUnreadCount.invalidate();
      toast.success("Old notifications deleted");
      setShowDeleteOptions(false);
    },
    onError: () => toast.error("Failed to delete old notifications"),
  });

  // Close delete options when there are no notifications
  useEffect(() => {
    if (notifications && notifications.length === 0) {
      setShowDeleteOptions(false);
    }
  }, [notifications]);

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
             {notifications && notifications.length > 0 && (
         <div className="mb-4 flex justify-between items-center">
           <div className="relative" ref={deleteOptionsRef}>
             <Button
               variant="secondary"
               onClick={() => setShowDeleteOptions(!showDeleteOptions)}
               disabled={isLoading}
               className="rounded-full px-4 py-2 text-sm font-semibold"
               style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
             >
               <MoreHorizontal className="w-4 h-4 mr-2" />
               Manage
             </Button>
             
             {showDeleteOptions && (
               <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-48">
                 <div className="p-2">
                   <button
                     onClick={() => deleteAllRead.mutate()}
                     disabled={deleteAllRead.status === "loading"}
                     className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <Trash2 className="w-4 h-4 mr-2" />
                     {deleteAllRead.status === "loading" ? "Deleting..." : "Delete all read"}
                   </button>
                   <button
                     onClick={() => deleteOld.mutate({ days: 7 })}
                     disabled={deleteOld.status === "loading"}
                     className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <Trash2 className="w-4 h-4 mr-2" />
                     {deleteOld.status === "loading" ? "Deleting..." : "Delete older than 7 days"}
                   </button>
                   <button
                     onClick={() => deleteOld.mutate({ days: 30 })}
                     disabled={deleteOld.status === "loading"}
                     className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <Trash2 className="w-4 h-4 mr-2" />
                     {deleteOld.status === "loading" ? "Deleting..." : "Delete older than 30 days"}
                   </button>
                 </div>
               </div>
             )}
           </div>
           
           <Button
             variant="primary"
             onClick={() => markAllAsRead.mutate()}
             disabled={markAllAsRead.status === "loading" || isLoading}
             className="rounded-full px-5 py-2 text-base font-semibold shadow-sm"
             style={{ cursor: (markAllAsRead.status === "loading" || isLoading) ? "wait" : "pointer", fontFamily: 'Plus Jakarta Sans, sans-serif' }}
           >
             {markAllAsRead.status === "loading" ? <Spinner className="w-4 h-4 mr-2" /> : "Mark all as read"}
           </Button>
         </div>
       )}
      <div className="max-h-96 overflow-y-auto">
        {!mounted || isLoading ? (
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
                {/* Action buttons */}
                <div className="flex gap-2">
                  {/* Mark as read button */}
                  {!n.isRead && (
                    <Button
                      variant="secondary"
                      onClick={() => markAsRead.mutate({ notificationId: n.id })}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ cursor: markAsRead.status === "loading" ? "wait" : "pointer", fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                      aria-label="Mark as read"
                    >
                      Read
                    </Button>
                  )}
                  
                  {/* Delete button */}
                  <Button
                    variant="secondary"
                    onClick={() => deleteNotification.mutate({ notificationId: n.id })}
                    disabled={deleteNotification.status === "loading"}
                    className="rounded-full px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    aria-label="Delete notification"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  
                  {/* View button for actionable notifications */}
                  {n.relatedEntityId && (
                    <Button
                      variant="primary"
                      onClick={() => handleView(n)}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                      aria-label="View related"
                    >
                      View
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-lg font-medium mb-1">All caught up!</div>
            <div className="text-base">You’ve read all your notifications. Check back later for updates.</div>
          </div>
        )}
      </div>
    </div>
  );
} 