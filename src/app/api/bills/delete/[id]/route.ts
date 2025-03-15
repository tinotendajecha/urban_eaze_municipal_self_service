import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.bill.delete({
        where: { id: params.id },
      });
  
      return new Response(
        JSON.stringify({ message: "Bill deleted successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting bill:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when deleting bill!" }),
        { status: 500 }
      );
    }
  }