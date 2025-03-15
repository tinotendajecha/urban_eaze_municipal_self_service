import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
    try {
      const { Service, Date_Time, Location, Frequency, Status, description } = await req.json();
  
      if (!Service || !Date_Time || !Location || !Frequency || !Status || !description) {
        return new Response(
          JSON.stringify({ message: "All fields are required!" }),
          { status: 400 }
        );
      }
  
      const newSchedule = await prisma.serviceSchedule.create({
        data: { Service, Date_Time, Location, Frequency, Status, description },
      });
  
      return new Response(
        JSON.stringify({ message: "Service schedule created successfully!", schedule: newSchedule }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating service schedule:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error when creating service schedule!" }),
        { status: 500 }
      );
    }
  }