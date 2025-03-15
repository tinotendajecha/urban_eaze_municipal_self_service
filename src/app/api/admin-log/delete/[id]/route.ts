import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.adminLog.delete({
        where: { id: params.id },
      });
  
      return new Response(
        JSON.stringify({ message: "Admin log deleted successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting admin log:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when deleting admin log!" }),
        { status: 500 }
      );
    }
  }