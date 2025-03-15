import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.permits.delete({
        where: { id: params.id },
      });
  
      return new Response(
        JSON.stringify({ message: "Permit deleted successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting permit:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when deleting permit!" }),
        { status: 500 }
      );
    }
  }