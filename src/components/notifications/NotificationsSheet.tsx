"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  Notification,
} from "@/providers/NotificationsProvider";
import { Bell, Check, X } from "lucide-react";
import { FC } from "react";

interface NotificationsProps {
  item: Notification;
}

const NotificationsComponent: FC<NotificationsProps> = ({ item }) => {
  const { removeItem, markAsRead } = useNotifications();

  return (
    <div
      onClick={() => markAsRead(item.id)}
      className={cn(
        "flex items-center gap-4 rounded-xl p-4",
        item.read ? "bg-muted/50" : "bg-muted/25",
      )}
    >
      <div className="flex flex-1 flex-col">
        <h3 className="text-base font-medium">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.message}</p>
      </div>
      {item.read ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <div className="h-4 w-4 rounded-full bg-primary" />
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => removeItem(item.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface NotificationsSheetProps {
  children: React.ReactNode;
}

export const NotificationsSheet: FC<NotificationsSheetProps> = ({
  children,
}) => {
  const { notifications } = useNotifications();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:w-[400px]"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Your Notifications
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4">
            {notifications.length > 0 ? (
              <div className="space-y-4 divide-y">
                {notifications.map((item) => (
                  <NotificationsComponent key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex h-[450px] flex-col items-center justify-center space-y-4">
                <Bell className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium text-muted-foreground">
                  No Notifications
                </p>
                <SheetClose asChild>
                  <Button variant="secondary">Close</Button>
                </SheetClose>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
