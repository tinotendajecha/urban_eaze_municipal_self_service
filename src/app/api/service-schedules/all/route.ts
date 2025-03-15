import prisma from "@/utils/dbconfig";

export async function GET() {
  try {
    // Fetch all service schedules
    const serviceSchedules = await prisma.serviceSchedule.findMany();

    return new Response(
      JSON.stringify({ message: "Success fetching all service schedules!", serviceSchedules }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service schedules:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching service schedules!" }),
      { status: 500 }
    );
  }
}