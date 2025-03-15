import prisma from "@/utils/dbconfig";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { amountPaid, paymentMethod, status, transactionId } = await req.json();
  
      const updatedPayment = await prisma.payment.update({
        where: { id: params.id },
        data: { amountPaid, paymentMethod, status, transactionId },
      });
  
      return new Response(
        JSON.stringify({ message: "Payment updated successfully!", payment: updatedPayment }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating payment:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when updating payment!" }),
        { status: 500 }
      );
    }
  }