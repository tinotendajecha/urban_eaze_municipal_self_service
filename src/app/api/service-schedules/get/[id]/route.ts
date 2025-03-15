import prisma from "@/utils/dbconfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const serviceSchedule = await prisma.serviceSchedule.findUnique({
      where: { id: params.id },
    });

    if (!serviceSchedule) {
      return new Response(
        JSON.stringify({ message: "Service schedule not found!" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Success fetching service schedule!", schedule: serviceSchedule }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service schedule:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching service schedule!" }),
      { status: 500 }
    );
  }
}