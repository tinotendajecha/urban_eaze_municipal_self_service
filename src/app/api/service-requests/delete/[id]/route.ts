import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.serviceRequest.delete({
        where: { id: params.id },
      });
  
      return new Response(
        JSON.stringify({ message: "Service request deleted successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting service request:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when deleting service request!" }),
        { status: 500 }
      );
    }
  }