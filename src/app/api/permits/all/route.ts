import prisma from "@/utils/dbconfig";

export async function GET() {
  try {
    // Fetch all permits
    const permits = await prisma.permits.findMany({
      include: { user: true }, // Include user details if needed
    });

    return new Response(
      JSON.stringify({ message: "Success fetching all permits!", permits }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching permits:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching permits!" }),
      { status: 500 }
    );
  }
}