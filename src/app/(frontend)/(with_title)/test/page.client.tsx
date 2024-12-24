"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNotifications } from "@/providers/NotificationsProvider";
import { v4 as uuidv4 } from "uuid";

const TestPageClient = () => {
  const { addItem } = useNotifications();
  return (
    <main className="min-h-screen">
      <section className="relative bg-dot-pattern py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
        <div className="container relative mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Add Test Notification
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
              <CardContent className="p-0">
                Send a test notification below.
                <Button
                  onClick={() =>
                    addItem({
                      id: uuidv4(),
                      title: "Test Notification",
                      message: "This is a test notification",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      read: false,
                      type: "message",
                    })
                  }
                >
                  Send Test Notification
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TestPageClient;
