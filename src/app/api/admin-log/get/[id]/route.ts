import prisma from "@/utils/dbconfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const adminLog = await prisma.adminLog.findUnique({
      where: { id: params.id },
      include: { admin: true }, // Include admin details if needed
    });

    if (!adminLog) {
      return new Response(
        JSON.stringify({ message: "Admin log not found!" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Success fetching admin log!", adminLog }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin log:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching admin log!" }),
      { status: 500 }
    );
  }
}
