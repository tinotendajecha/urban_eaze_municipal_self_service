import prisma from "@/utils/dbconfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: { user: true, bill: true },
    });

    if (!payment) {
      return new Response(
        JSON.stringify({ message: "Payment not found!" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Success fetching payment!", payment }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payment:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching payment!" }),
      { status: 500 }
    );
  }
}