import { UserManagementClient } from "./user-management-client"
import prisma from "@/lib/prisma"

async function getUsersData(page, pageSize) {
    const skip = (page - 1) * pageSize;

    try {
        const [users, total] = await Promise.all([
            prisma.user.findMany({
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
                    createdAt: true,
                },
            }),
            prisma.user.count(),
        ]);

        return {
            users: JSON.parse(JSON.stringify(users)),
            total,
            page,
            pageSize
        };
    } catch (error) {
        console.error("Database fetch error:", error);
        return { users: [], total: 0, page, pageSize };
    }
}

export default async function UserManagementPage({ searchParams }) {
    const params = await searchParams
    const pageNum = parseInt(Array.isArray(params.page) ? params.page[0] : params.page || "1", 10)
    const pageSizeNum = parseInt(Array.isArray(params.pageSize) ? params.pageSize[0] : params.pageSize || "10", 10)

    const { users, total, page, pageSize } = await getUsersData(pageNum, pageSizeNum)

    return (
        <div className="container mx-auto px-10 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
                <p className="text-slate-500">
                    Manage system users and their roles from here.
                </p>
            </div>

            <UserManagementClient
                users={users}
                total={total}
                page={page}
                pageSize={pageSize}
            />
        </div>
    )
}
