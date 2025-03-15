import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.serviceSchedule.delete({
        where: { id: params.id },
      });
  
      return new Response(
        JSON.stringify({ message: "Service schedule deleted successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting service schedule:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when deleting service schedule!" }),
        { status: 500 }
      );
    }
  }