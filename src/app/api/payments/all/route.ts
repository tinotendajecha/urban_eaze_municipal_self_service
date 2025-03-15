import prisma from "@/utils/dbconfig";

export async function GET() {
  try {
    // Fetch all payments with user and bill details
    const payments = await prisma.payment.findMany({
      include: { user: true, bill: true },
    });

    return new Response(
      JSON.stringify({ message: "Success fetching all payments!", payments }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payments:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching payments!" }),
      { status: 500 }
    );
  }
}