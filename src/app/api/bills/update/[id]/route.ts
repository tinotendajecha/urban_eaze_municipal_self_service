import prisma from "@/utils/dbconfig";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { billType, amount, dueDate, status } = await req.json();
  
      const updatedBill = await prisma.bill.update({
        where: { id: params.id },
        data: { billType, amount, dueDate, status },
      });
  
      return new Response(
        JSON.stringify({ message: "Bill updated successfully!", bill: updatedBill }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating bill:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when updating bill!" }),
        { status: 500 }
      );
    }
  }