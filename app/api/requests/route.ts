import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const visitorSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  citizenshipNo: z.string().min(5, "ID number is required"),
  organization: z.string().min(2, "Organization is required"),
  purpose: z.string().min(5, "Please state your purpose"),
  personToMeet: z.string().min(2, "Name of person to meet is required"),
  visitDate: z.string().or(z.date()),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = visitorSchema.parse(body);

    const request = await prisma.visitorRequest.create({
      data: {
        ...validatedData,
        visitDate: new Date(validatedData.visitDate),
        status: "PENDING",
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Request Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await prisma.visitorRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
