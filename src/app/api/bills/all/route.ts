import prisma from "@/utils/dbconfig";

export async function GET() {
  try {
    // Fetch all bills along with user details
    const bills = await prisma.bill.findMany({
      include: { user: true, payments: true },
    });

    return new Response(
      JSON.stringify({ message: "Success fetching all bills!", bills }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bills:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching bills!" }),
      { status: 500 }
    );
  }
}