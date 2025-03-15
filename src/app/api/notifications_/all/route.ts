import prisma from "@/utils/dbconfig";

export async function GET() {
  try {
    // Fetch all notifications
    const notifications = await prisma.notification.findMany();

    return new Response(
      JSON.stringify({ message: "Success fetching all notifications!", notifications }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching notifications!" }),
      { status: 500 }
    );
  }
}
