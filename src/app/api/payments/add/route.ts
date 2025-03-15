import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
    try {
      const { userId, billId, amountPaid, paymentMethod, transactionId, status } =
        await req.json();
  
      if (!userId || !billId || !amountPaid || !paymentMethod || !transactionId) {
        return new Response(
          JSON.stringify({ message: "All fields are required!" }),
          { status: 400 }
        );
      }
  
      const newPayment = await prisma.payment.create({
        data: { userId, billId, amountPaid, paymentMethod, transactionId, status },
      });
  
      return new Response(
        JSON.stringify({ message: "Payment created successfully!", payment: newPayment }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating payment:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when creating payment!" }),
        { status: 500 }
      );
    }
  }
  