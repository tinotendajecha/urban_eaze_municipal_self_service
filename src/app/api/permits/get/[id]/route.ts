import prisma from "@/utils/dbconfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const permit = await prisma.permits.findUnique({
      where: { id: params.id },
      include: { user: true }, // Include user details if needed
    });

    if (!permit) {
      return new Response(
        JSON.stringify({ message: "Permit not found!" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Success fetching permit!", permit }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching permit:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching permit!" }),
      { status: 500 }
    );
  }
}
