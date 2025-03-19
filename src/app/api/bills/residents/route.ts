import prisma from "@/utils/dbconfig";
import { generateBillId } from "@/lib/generateBillId";
import { generatePaymentId } from "@/lib/generatePaymentId";

export async function POST(req: Request) {
  try {
    if (!req.body) {
      throw new Error("Request body is empty or undefined");
    }

    const data = await req.json();

    if (!data || typeof data !== "object") {
      throw new Error("Invalid JSON payload");
    }

    const {
      userId,
      amountPaid,
      paymentMethod,
      description,
      standType,
      payment_for,
    } = data;

    console.log("Detail: ", paymentMethod);

    const billId = await generateBillId();

    let find_residents: {
      id: string;
      name: string | null;
      email: string | null;
      phone: string | null;
      password: string | null;
      role: string | null;
      standType: string | null;
      address: string | null;
      createdAt: Date;
    }[];

    if (standType == "ALL") {
      find_residents = await prisma.user.findMany({
        where: {
          standType: {
            not: "SYSTEM",
          },
        },
      });
    } else {
      find_residents = await prisma.user.findMany({
        where: {
          standType: standType,
        },
      });
    }

    let second_leg_payment;
    let amount: number = 0;

    if (!find_residents) {
      return new Response(JSON.stringify({ error: "Residents not found" }), {
        status: 400,
      });
    }

    const second_leg_payments = await Promise.all(
      find_residents.map(async (resident) => {
        amount = amount + Number(amountPaid);
        const second_leg = {
          reference: `${userId}_${payment_for}_${amountPaid}`,
          transactionCode: -1,
          status: "DEBITED",
          paymentMethod: paymentMethod,
          type: "BILL",
          amountPaid: amountPaid,
          payment_for: payment_for,
          account: resident.id,
          transactionId: billId,
          description: description,
        };

        return await prisma.payment.create({ data: second_leg });
      })
    );

    const first_leg = {
      reference: `${userId}_${payment_for}_${amountPaid}`,
      transactionCode: 1,
      status: "CREDITED",
      paymentMethod: paymentMethod,
      amountPaid: amount,
      type: "BILL",
      payment_for: payment_for,
      account: userId,
      transactionId: billId,
      description,
    };

    const first_leg_payment = await prisma.payment.create({ data: first_leg });

    if (first_leg_payment && second_leg_payments.every(Boolean)) {
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
