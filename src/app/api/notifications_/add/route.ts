import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
    try {
      const { userId, message, status } = await req.json();
  
      if (!userId || !message) {
        return new Response(
          JSON.stringify({ message: "User ID and message are required!" }),
          { status: 400 }
        );
      }
  
      const newNotification = await prisma.notification.create({
        data: { userId, message, status },
      });
  
      return new Response(
        JSON.stringify({ message: "Notification created successfully!", notification: newNotification }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating notification:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when creating notification!" }),
        { status: 500 }
      );
    }
  }