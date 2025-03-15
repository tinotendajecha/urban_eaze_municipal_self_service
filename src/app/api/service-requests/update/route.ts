import prisma from "@/utils/dbconfig";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { category, description, status, assignedTo } = await req.json();
  
      const updatedRequest = await prisma.serviceRequest.update({
        where: { id: params.id },
        data: { category, description, status, assignedTo },
      });
  
      return new Response(
        JSON.stringify({ message: "Service request updated successfully!", request: updatedRequest }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating service request:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when updating service request!" }),
        { status: 500 }
      );
    }
  }