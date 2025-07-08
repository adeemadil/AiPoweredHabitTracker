"use client";
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { trpc } from "@/lib/trpc/init";
import { Spinner } from "@/components/ui/Spinner";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: notifications, isLoading } = trpc.notifications.list.useQuery();
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <>
      <Button
        variant="secondary"
        aria-label="Notifications"
        className="relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <Bell className="w-6 h-6" />
        {isLoading ? (
          <span className="absolute -top-1 -right-1"><Spinner className="w-4 h-4" /></span>
        ) : unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
            {unreadCount}
          </span>
        ) : null}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <NotificationPanel onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
} 