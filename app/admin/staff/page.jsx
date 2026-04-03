import { StaffClient } from "./staff-client"
import prisma from "@/lib/prisma"

async function getStaffData(page, pageSize, search) {
  const skip = (page - 1) * pageSize;

  try {
    const where = {
      role: { in: ["ADMIN", "VET"] },
      ...(search ? {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ]
      } : {})
    };

    const [staffs, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          address: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      staffs: JSON.parse(JSON.stringify(staffs)),
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error("Database fetch error (staff):", error);
    return { staffs: [], total: 0, page, pageSize };
  }
}

export default async function StaffPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  const { staffs, total, page, pageSize } = await getStaffData(pageNum, pageSizeNum, search)

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Staff Management</h1>
        <p className="text-slate-500 font-inter">
          Manage your hospital's administrators and veterinarians here.
        </p>
      </div>

      <StaffClient
        staffs={staffs}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}
