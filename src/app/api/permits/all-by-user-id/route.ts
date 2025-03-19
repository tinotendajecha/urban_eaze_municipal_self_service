import prisma from "@/utils/dbconfig";

export async function GET(req: Request) {
  try {
    
    // Extract `userId` from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // console.log(userId)

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "userId is required as a query parameter!" }),
        { status: 400 }
      );
    }

    // Fetch permits for the given userId
    const permits = await prisma.permits.findMany({
      where: { userId },
      include: { user: true }, // Include user details if needed
    });

    return new Response(
      JSON.stringify({ message: "Success fetching permits!", permits }),
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
