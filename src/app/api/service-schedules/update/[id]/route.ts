import prisma from "@/utils/dbconfig";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { Service, Date_Time, Location, Frequency, Status, description } = await req.json();
  
      const updatedSchedule = await prisma.serviceSchedule.update({
        where: { id: params.id },
        data: { Service, Date_Time, Location, Frequency, Status, description },
      });
  
      return new Response(
        JSON.stringify({ message: "Service schedule updated successfully!", schedule: updatedSchedule }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating service schedule:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when updating service schedule!" }),
        { status: 500 }
      );
    }
  }
  