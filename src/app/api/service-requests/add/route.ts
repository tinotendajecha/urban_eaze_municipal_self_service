import prisma from "@/utils/dbconfig";
import { generateTicketId } from "@/lib/generateTicketId";

export async function POST(req: Request) {
  try {
    const { userId, type, description, location, priority, assignedTo } =
      await req.json();

    console.log();

    if (!userId || !type || !description) {
      return new Response(
        JSON.stringify({
          message: "User ID, type, and description are required!",
        }),
        { status: 400 }
      );
    }
    const ticketId = await generateTicketId();

    const newRequest = await prisma.ticket.create({
      data: {
        userId,
        ticketId,
        type,
        location,
        description,
        priority,
        assignedTo,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Service request created successfully!",
        request: newRequest,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service request:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error when creating service request!",
      }),
      { status: 500 }
    );
  }
}
