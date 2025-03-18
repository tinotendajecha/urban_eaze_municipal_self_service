import prisma from "@/utils/dbconfig";

export async function GET() {
  try {
    // Fetch all service requests with user details
    const serviceRequests = await prisma.ticket.findMany({
      include: { user: true },
    });

    return new Response(
      JSON.stringify({ message: "Success fetching all service requests!", serviceRequests }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching service requests!" }),
      { status: 500 }
    );
  }
}