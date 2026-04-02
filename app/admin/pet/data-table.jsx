"use client"

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DataTable({
    columns,
    data,
    pageCount,
    pageIndex,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: pageCount,
    })

    const canPreviousPage = pageIndex > 1
    const canNextPage = pageIndex < pageCount

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50 border-b border-slate-200">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-12 font-semibold text-slate-900 border-none">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-48 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <span className="text-lg font-medium">No results found.</span>
                                        <p className="text-sm">Try adjusting your search or filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-6">
                    <div className="text-sm text-slate-500 font-medium">
                        Page {pageIndex} of {pageCount || 1}
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-slate-500 whitespace-nowrap">Rows per page</p>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => onPageSizeChange(Number(value))}
                        >
                            <SelectTrigger className="h-9 w-[80px] bg-white border-slate-200">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top" className="bg-white border-slate-200">
                                {[5, 10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(pageIndex - 1)}
                        disabled={!canPreviousPage}
                        className="h-9 w-9 p-0 flex items-center justify-center bg-white border-slate-200 disabled:opacity-50 hover:bg-slate-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(pageIndex + 1)}
                        disabled={!canNextPage}
                        className="h-9 w-9 p-0 flex items-center justify-center bg-white border-slate-200 disabled:opacity-50 hover:bg-slate-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
