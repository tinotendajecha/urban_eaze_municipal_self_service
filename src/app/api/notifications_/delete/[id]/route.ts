import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.notification.delete({
        where: { id: params.id },
      });
  
      return new Response(
        JSON.stringify({ message: "Notification deleted successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when deleting notification!" }),
        { status: 500 }
      );
    }
  }