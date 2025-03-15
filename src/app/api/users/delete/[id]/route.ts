import prisma from "@/utils/dbconfig";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.user.delete({
        where: { id: params.id },
      });
  
      return new Response(
        JSON.stringify({ message: "User deleted successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when deleting user!" }),
        { status: 500 }
      );
    }
  }