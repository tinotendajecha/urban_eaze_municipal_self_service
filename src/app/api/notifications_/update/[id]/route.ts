import prisma from "@/utils/dbconfig";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { message, status } = await req.json();
  
      const updatedNotification = await prisma.notification.update({
        where: { id: params.id },
        data: { message, status },
      });
  
      return new Response(
        JSON.stringify({ message: "Notification updated successfully!", notification: updatedNotification }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating notification:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when updating notification!" }),
        { status: 500 }
      );
    }
  }