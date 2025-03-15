import prisma from "@/utils/dbconfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const bill = await prisma.bill.findUnique({
      where: { id: params.id },
      include: { user: true, payments: true },
    });

    if (!bill) {
      return new Response(
        JSON.stringify({ message: "Bill not found!" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Success fetching bill!", bill }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bill:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error when fetching bill!" }),
      { status: 500 }
    );
  }
}