import prisma from "@/utils/dbconfig";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { permitType, description, location, submissionDate, status } = await req.json();
  
      const updatedPermit = await prisma.permits.update({
        where: { id: params.id },
        data: { permitType, description, location, submissionDate: new Date(submissionDate), status },
      });
  
      return new Response(
        JSON.stringify({ message: "Permit updated successfully!", permit: updatedPermit }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating permit:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when updating permit!" }),
        { status: 500 }
      );
    }
  }