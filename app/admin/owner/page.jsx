import { OwnerManagementClient } from "./owner-client"
import prisma from "@/lib/prisma"

async function getOwners(page, pageSize, search) {
  const skip = (page - 1) * pageSize;

  try {
    const where = {
      role: "OWNER",
      ...(search ? {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ]
      } : {})
    };

    const [owners, total] = await Promise.all([
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
          pets: {
            select: {
              id: true,
              name: true,
              species: true,
            }
          }
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      owners: JSON.parse(JSON.stringify(owners)),
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error("Database fetch error (owner):", error);
    return { owners: [], total: 0, page, pageSize };
  }
}

export default async function OwnerPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  const { owners, total, page, pageSize } = await getOwners(pageNum, pageSizeNum, search)

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Owner Management</h1>
        <p className="text-slate-500 font-inter">
          Manage pet owner profiles, contact information, and view their registered pets.
        </p>
      </div>

      <OwnerManagementClient
        owners={owners}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}
