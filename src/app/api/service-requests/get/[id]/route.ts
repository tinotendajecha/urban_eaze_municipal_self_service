import prisma from "@/utils/dbconfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!serviceRequest) {
      return new Response(
        JSON.stringify({ message: "Service request not found!" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Success fetching service request!", request: serviceRequest }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service request:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching service request!" }),
      { status: 500 }
    );
  }
}