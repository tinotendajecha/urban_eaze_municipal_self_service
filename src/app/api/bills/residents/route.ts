import prisma from "@/utils/dbconfig";
import { generatePaymentId } from "@/lib/generatePaymentId";

export async function POST(req: Request) {
  try {
    const { userId, amountPaid, paymentMethod, description,standType, payment_for } =
      await req.json();

    const paymentId = await generatePaymentId();

   
    const find_residents = await prisma.user.findMany({
      where: {
        standType: standType,
      },
    });

    let second_leg_payment;
    let amount: number = 0;

    if (!find_residents) {
      return new Response(JSON.stringify({ error: "Residents not found" }), {
        status: 400,
      });
    }

    find_residents.map(async (resident, key) => {
      amount = amount + Number(amountPaid);
      const second_leg = {
        reference: `${userId}_${payment_for}_${amountPaid}`,
        transactionCode: -1,
        status: "DEBITED",
        paymentMethod: paymentMethod,
        amountPaid: amountPaid,
        payment_for: payment_for,
        account: resident.id,
        transactionId: paymentId,
        description: description,
      };

      second_leg_payment = await prisma.payment.create({ data: second_leg });
    });

    const first_leg = {
      reference: `${userId}_${payment_for}_${amountPaid}`,
      transactionCode: 1,
      status: "CREDITED",
      paymentMethod: paymentMethod,
      amountPaid: amount,
      payment_for: payment_for,
      account: userId,
      transactionId: paymentId,
      description,
    };

    const first_leg_payment = await prisma.payment.create({ data: first_leg });

    if (first_leg_payment && second_leg_payment) {
      return new Response(JSON.stringify({ message: "Transaction success" }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Transaction Failed" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
