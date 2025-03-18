import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    console.log(id)

    if (!id) {
      return new Response(
        JSON.stringify({ message: "User ID is required!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete the user
    await prisma.user.delete({ where: { id } });

    return new Response(
      JSON.stringify({ message: "User deleted successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting user:", error);

    return new Response(
      JSON.stringify({ message: "Internal server error when deleting user!" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
