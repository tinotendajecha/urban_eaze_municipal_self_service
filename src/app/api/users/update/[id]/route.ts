import prisma from "@/utils/dbconfig";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { name, email, phone, password, role } = await req.json();
  
      const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data: { name, email, phone, password, role },
      });
  
      return new Response(
        JSON.stringify({ message: "User updated successfully!", user: updatedUser }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when updating user!" }),
        { status: 500 }
      );
    }
  }