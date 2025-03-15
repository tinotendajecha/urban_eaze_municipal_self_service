import prisma from "@/utils/dbconfig";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { action } = await req.json();
  
      const updatedAdminLog = await prisma.adminLog.update({
        where: { id: params.id },
        data: { action },
      });
  
      return new Response(
        JSON.stringify({ message: "Admin log updated successfully!", adminLog: updatedAdminLog }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating admin log:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when updating admin log!" }),
        { status: 500 }
      );
    }
  }
  