import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.payment.delete({
        where: { id: params.id },
      });
  
      return new Response(
        JSON.stringify({ message: "Payment deleted successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting payment:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when deleting payment!" }),
        { status: 500 }
      );
    }
  }