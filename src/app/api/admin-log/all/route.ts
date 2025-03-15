import prisma from "@/utils/dbconfig";

export async function GET() {
  try {
    // Fetch all admin logs
    const adminLogs = await prisma.adminLog.findMany({
      include: { admin: true }, // Include admin details if needed
    });

    return new Response(
      JSON.stringify({ message: "Success fetching all admin logs!", adminLogs }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching admin logs!" }),
      { status: 500 }
    );
  }
}
