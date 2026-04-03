import { AppointmentManagementClient } from "./appointment-client"
import prisma from "@/lib/prisma"

async function getAppointments(page, pageSize, search, filter) {
  const skip = (page - 1) * pageSize;

  try {
    let where = search 
      ? {
          OR: [
            { reason: { contains: search } },
            { pet: { name: { contains: search } } },
            { owner: { firstName: { contains: search } } },
            { owner: { lastName: { contains: search } } },
          ]
        }
      : {};

    if (filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      where = {
        ...where,
        date: {
          gte: today,
          lt: tomorrow,
        }
      };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          pet: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            }
          }
        },
        orderBy: { date: "asc" },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      appointments: JSON.parse(JSON.stringify(appointments)),
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error("Database fetch error (appointment):", error);
    return { appointments: [], total: 0, page, pageSize };
  }
}

export default async function AppointmentPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""
  const filter = params.filter || ""

  const { appointments, total, page, pageSize } = await getAppointments(pageNum, pageSizeNum, search, filter)

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Appointments</h1>
        <p className="text-slate-500 font-inter">
          Manage the clinic schedule and track pet visit statuses.
        </p>
      </div>

      <AppointmentManagementClient
        appointments={appointments}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}
