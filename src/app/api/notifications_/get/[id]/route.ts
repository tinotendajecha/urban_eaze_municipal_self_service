import prisma from "@/utils/dbconfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id: params.id },
      });
  
      if (!notification) {
        return new Response(
          JSON.stringify({ message: "Notification not found!" }),
          { status: 404 }
        );
      }
  
      return new Response(
        JSON.stringify({ message: "Success fetching notification!", notification }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching notification:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when fetching notification!" }),
        { status: 500 }
      );
    }
  }