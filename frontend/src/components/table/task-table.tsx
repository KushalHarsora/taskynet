import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Task } from "@/lib/types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog"
import { Textarea } from "../ui/textarea";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form"
import axios, { AxiosResponse } from "axios"
import { domain } from "@/lib/consts"
import { toast } from "sonner"

// Form Schema
const formSchema = z.object({
    taskName: z.string().min(2, {
        message: "Task must be minimum two characters long"
    }),
    color: z.string()
});

const handleDelete = async (id: string) => {
    try {
        const email = window.localStorage.getItem("email");
        const response: AxiosResponse = await axios.delete(`${domain}/api/task/delete/${email}`, {
            data: {
                id: id,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (response.status === 200) {
            toast.success(data.message || "Task deleted successfully", {
                style: {
                    "backgroundColor": "#D5F5E3",
                    "color": "black",
                    "border": "none"
                },
                duration: 1500
            });

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const data = error.response;
            if (data.status === 404) {
                toast.error("User Not Found. Kindly relogin", {
                    style: {
                        "backgroundColor": "#FADBD8",
                        "color": "black",
                        "border": "none"
                    },
                    duration: 2500
                })
            } else {
                toast.error("Some Error Occured", {
                    style: {
                        "backgroundColor": "#FADBD8",
                        "color": "black",
                        "border": "none"
                    },
                    duration: 2500
                });
            }
        } else {
            toast.error("An unexpected error occurred. Please try again.", {
                invert: false,
                duration: 2500
            });
        }
    }
}

const handleComplete = async (id: string) => {
    try {
        const email = window.localStorage.getItem("email");
        const response: AxiosResponse = await axios.post(`${domain}/api/task/complete/${email}`, { id: id }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data;

        if (response.status === 200) {
            toast.success(data.message || "Task marked as completed", {
                style: {
                    "backgroundColor": "#D5F5E3",
                    "color": "black",
                    "border": "none"
                },
                duration: 1500
            });

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const data = error.response;
            if (data.status === 404) {
                toast.error("User Not Found. Kindly relogin", {
                    style: {
                        "backgroundColor": "#FADBD8",
                        "color": "black",
                        "border": "none"
                    },
                    duration: 2500
                })
            } else {
                toast.error("Some Error Occured", {
                    style: {
                        "backgroundColor": "#FADBD8",
                        "color": "black",
                        "border": "none"
                    },
                    duration: 2500
                });
            }
        } else {
            toast.error("An unexpected error occurred. Please try again.", {
                invert: false,
                duration: 2500
            });
        }
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "taskName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tasks
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className=" capitalize">{row.original.taskName}</div>,
    },
    {
        accessorKey: "Created At",
        header: () => {
            return (
                <Button
                    variant="ghost"
                >
                    Created At
                </Button>
            )
        },
        cell: ({ row }) =>
            <div className=" capitalize">
                {new Date(row.original.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>,
    },
    {
        accessorKey: "Status",
        header: () => {
            return (
                <Button
                    variant="ghost"
                >
                    Status
                </Button>
            )
        },
        cell: ({ row }) =>
            <div
                className={`capitalize px-2 py-1 rounded-md text-white text-center max-w-[120px] ${row.original.status ? "bg-green-500" : "bg-red-500"}`}
            >
                {row.original.status ? "Completed" : "Not Completed"}
            </div>,
    },
    {
        accessorKey: "Type",
        header: () => (
            <Button variant="ghost">
                Type
            </Button>
        ),
        cell: ({ row }) => {
            const color = row.original.color?.startsWith("#") ? row.original.color : `#${row.original.color}`;
            return (
                <div className=" max-w-[50px] flex justify-center items-center gap-2">
                    <div
                        className="w-12 h-4 rounded-full border"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                </div>
            );
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const id = row.original._id;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleComplete(id)}>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(id)}>Delete Task</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function TaskTable({ data }: { data: Task[] }) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            taskName: "",
            color: "#f2d312",
        }
    });

    const submitForm = async (values: z.infer<typeof formSchema>) => {
        const email = window.localStorage.getItem("email");
        try {
            const response: AxiosResponse = await axios.post(`${domain}/api/task/add`, { data: values, email: email }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = response.data;

            if (response.status === 200) {
                toast.success(data.message || "Task Added", {
                    style: {
                        "backgroundColor": "#D5F5E3",
                        "color": "black",
                        "border": "none"
                    },
                    duration: 1500
                });
                form.reset();
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const data = error.response;
                if (data.status === 404) {
                    toast.error("User Not Found. Kindly relogin and add task", {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    })
                    form.reset();
                } else {
                    toast.error("Some Error Occured", {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    });
                    form.reset();
                }
            } else {
                toast.error("An unexpected error occurred. Please try again.", {
                    invert: false,
                    duration: 2500
                });
            }
        }
    }


    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex justify-between items-center py-4">
                <Input
                    placeholder="Search tasks..."
                    value={(table.getColumn("taskName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("taskName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className=" flex flex-row gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" className="ml-auto">
                                Add Task <Plus />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Task</DialogTitle>
                                <DialogDescription>
                                    Add Tasks here. Select a color and click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(submitForm)} className=" space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="taskName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Task</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="color"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Task</FormLabel>
                                                    <FormControl>
                                                        <Input className="col-span-3 h-10 w-full p-0 border-none cursor-pointer bg-transparent" type="color" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button type="submit">Add Task</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id === "taskName" ? "Tasks" : column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No Tasks Availabe.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TaskTable;