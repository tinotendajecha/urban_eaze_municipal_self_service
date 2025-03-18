import prisma from "@/utils/dbconfig";

export const generateTicketId = async () =>{
  // Get the count of tickets
  const count = await prisma.ticket.count();
  // Generate the ticket ID in the format TKT-001
  const ticketNumber = (count + 1).toString().padStart(3, "0");
  return `TKT-${ticketNumber}`;
}