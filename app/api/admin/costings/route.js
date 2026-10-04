import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { ownerId, petId, notes, items } = await request.json();

    if (!ownerId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Client and at least one cost item are required" }, { status: 400 });
    }

    // Process & validate rows
    const processedItems = [];
    for (const i of items) {
      const quantity = parseInt(i.quantity, 10);
      const price = parseFloat(i.price);

      if (!i.description || !i.description.trim()) {
        return NextResponse.json({ error: "Every item requires a description" }, { status: 400 });
      }

      if (isNaN(quantity) || quantity <= 0) {
        return NextResponse.json({ error: `Invalid quantity for "${i.description}"` }, { status: 400 });
      }

      if (isNaN(price) || price < 0) {
        return NextResponse.json({ error: `Invalid price for "${i.description}"` }, { status: 400 });
      }

      const itemData = {
        category: i.category || "OTHER",
        description: i.description.trim(),
        quantity,
        price,
        total: quantity * price,
        medicationId: i.medicationId || null,
      };

      // Check inventory if linked to a medication
      if (itemData.medicationId) {
        const med = await prisma.medication.findUnique({
          where: { id: itemData.medicationId },
        });

        if (!med) {
          return NextResponse.json({ error: `Medication "${i.description}" not found in inventory` }, { status: 400 });
        }

        if (quantity > med.stock) {
          return NextResponse.json(
            { error: `Cannot add ${quantity} units of "${med.name}". Available stock: ${med.stock}` },
            { status: 400 }
          );
        }
      }

      processedItems.push(itemData);
    }

    const totalAmount = processedItems.reduce((sum, r) => sum + r.total, 0);

    // Create costing and decrement medication stock in a transaction
    const costing = await prisma.$transaction(async (tx) => {
      const createdCosting = await tx.costing.create({
        data: {
          ownerId,
          petId: petId || null,
          notes: notes ? notes.trim() : null,
          totalAmount,
          items: {
            create: processedItems.map((item) => ({
              category: item.category,
              description: item.description,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
              medicationId: item.medicationId,
            })),
          },
        },
        include: { items: true },
      });

      // Decrement medication stock
      for (const item of processedItems) {
        if (item.medicationId) {
          await tx.medication.update({
            where: { id: item.medicationId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return createdCosting;
    });

    return NextResponse.json({ costing }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/costings]", error);
    return NextResponse.json({ error: error.message || "Failed to save costing" }, { status: 500 });
  }
}
