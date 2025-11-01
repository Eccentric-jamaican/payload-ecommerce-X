"use client";

import { createContext, FC, useContext, useState, type ReactNode } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  updatedAt: string;
  createdAt: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  clearNotifications: () => void;
  addItem: (notification: Notification) => void;
  removeItem: (notificationId: string) => void;
  markAsRead: (notificationId: string) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addItem = (notification: Notification) => {
    setNotifications((currentItems) => {
      return [...currentItems, notification];
    });
  };

  const removeItem = (notificationId: string) => {
    setNotifications((currentItems) =>
      currentItems.filter((item) => item.id !== notificationId),
    );
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((currentItems) =>
      currentItems.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item,
      ),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        clearNotifications,
        addItem,
        removeItem,
        markAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};
