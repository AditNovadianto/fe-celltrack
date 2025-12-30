import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import profilePicture from "../../images/profile-picture.png"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "@/utils/auth";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button";
import { Bell, Check, ChevronDownIcon, SquarePen, Trash2, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

type CustomerEmployeeProps = {
    setSection: (section: string) => void
}

const CustomersEmployee: React.FC<CustomerEmployeeProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number }>();
    const [customers, setCustomers] = useState<Array<{ id_pelanggan: number, nama_pelanggan: string, dob: string, email: string, no_telephon: string, id_toko: string }>>()
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [newCustomer, setNewCustomer] = useState<{ nama_pelanggan: string; dob: string; email: string; no_telephon: string }>({
        nama_pelanggan: "",
        email: "",
        dob: "",
        no_telephon: "",
    });
    const [showCreate, setShowCreate] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error"; visible: boolean; }>({
        message: "", type: "success", visible: false
    });
    const [notifications, setNotifications] = useState<{ read?: boolean }[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/")
        }
    }, [])

    // Pagination
    const ITEMS_PER_PAGE = 5

    const totalPages = Math.ceil((customers?.length ?? 0) / ITEMS_PER_PAGE)

    const paginatedCustomers = customers?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )
    // 

    useEffect(() => {
        const user = localStorage.getItem("user");
        const userObj = JSON.parse(user || "{}");

        if (user) {
            setAdmin(userObj);
        }
    }, [])

    useEffect(() => {
        const getAllCustomers = async () => {
            try {
                const response = await fetch("http://localhost:3000/getAllCustomers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Customers gagal")
                }

                const data = await response.json()

                setCustomers(data.customers)
            } catch (error) {
                console.error(error)
            }
        }

        const getAllNotifications = async () => {
            try {
                const response = await fetch("http://localhost:3000/getAllNotifications", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Notifications gagal")
                }

                const data = await response.json()

                console.log("Notifications", data)

                setNotifications(data.notifications)
            } catch (error) {
                console.error(error)
            }
        }

        getAllCustomers();
        getAllNotifications();
    }, [showCreate, showUpdate, showDelete])

    console.log("Customers", customers)

    // Create Customer
    const createHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:3000/createCustomer",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(newCustomer),
                }
            );

            if (!response.ok) {
                throw new Error("Gagal menambah customer");
            }

            const data = await response.json();

            setCustomers((prev) => [data.customer, ...(prev ?? [])]);
            setShowCreate(false);

            setNewCustomer({
                nama_pelanggan: "",
                dob: "",
                email: "",
                no_telephon: "",
            });
            setDate(undefined);

            showNotification("Customer berhasil ditambahkan", "success");
        } catch (error) {
            showNotification("Gagal menambahkan customer", "error");
            console.error(error);
        }
    };
    // 

    // Update Customer
    const updateHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/updateCustomerById/${selectedCustomer.id_pelanggan}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(selectedCustomer),
                }
            );

            if (response.ok) {
                setCustomers((prev) =>
                    prev?.map((c) =>
                        c.id_pelanggan === selectedCustomer.id_pelanggan
                            ? selectedCustomer
                            : c
                    )
                );

                setShowUpdate(false);

                showNotification("Customer berhasil diperbarui", "success");
            }
        } catch (error) {
            showNotification("Gagal memperbarui customer", "error");
            console.error(error);
        }
    }
    // 

    // Delete Customer
    const deleteHandler = async (id_pelanggan: string) => {
        try {
            const response = await fetch(`http://localhost:3000/deleteCustomerById/${id_pelanggan}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            );

            if (response.ok) {
                setCustomers((prev) =>
                    prev?.filter(
                        (c) =>
                            c.id_pelanggan !==
                            selectedCustomer.id_pelanggan
                    )
                );

                setShowDelete(false);

                showNotification("Customer berhasil dihapus", "success");
            }
        } catch (error) {
            showNotification("Gagal menghapus customer", "error");
            console.error(error);
        }
    }

    function formatDateDDMMYYYY(isoString: string): string {
        const date = new Date(isoString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    const showNotification = (
        message: string,
        type: "success" | "error" = "success"
    ) => {
        setNotification({
            message,
            type,
            visible: true,
        });

        setTimeout(() => {
            setNotification((prev) => ({ ...prev, visible: false }));
        }, 3000);
    };

    return (
        <div className="p-5 relative h-full md:min-h-screen">
            <div className="flex items-center gap-5 w-full justify-between">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Customers</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex items-center gap-10">
                    <button className="fixed bottom-24 right-5 bg-blue-300 rounded-full p-3 sm:relative sm:bg-transparent sm:p-0 sm:bottom-0 sm:right-0 cursor-pointer" onClick={() => setSection("Notifications")}>
                        <Bell size={30} />

                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-white text-blue-900 sm:bg-blue-500 sm:text-white rounded-full flex items-center justify-center">
                            <p>{notifications.filter((notification) => notification.read === false).length}</p>
                        </div>
                    </button>

                    <div className="cursor-pointer flex items-center gap-5 bg-blue-100 px-5 py-2 rounded-md">
                        <img className="w-10" src={profilePicture} alt="" />

                        <div>
                            <p className="font-semibold">{admin?.nama_user}</p>

                            <p>{admin?.id_role === 1 ? "Admin" : "Employee"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id Pelanggan</TableHead>
                            <TableHead>Nama Pelanggan</TableHead>
                            <TableHead>Tanggal Lahir</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>No Telephon</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCustomers && paginatedCustomers.map((customer) => (
                            <TableRow>
                                <TableCell className="font-medium">{customer?.id_pelanggan}</TableCell>
                                <TableCell>{customer?.nama_pelanggan}</TableCell>
                                <TableCell>{formatDateDDMMYYYY(customer?.dob)}</TableCell>
                                <TableCell>{customer?.email}</TableCell>
                                <TableCell>{customer?.no_telephon}</TableCell>
                                <TableCell className="space-x-2">
                                    <Button
                                        size="sm"
                                        className="bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setShowUpdate(true);
                                        }}
                                    >
                                        <SquarePen />
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setShowDelete(true);
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-end space-x-2 mt-4">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-5 mb-20 lg:mb-0 w-full left-[50%] transform -translate-x-1/2 px-5">
                <Button onClick={() => setShowCreate(true)} className="cursor-pointer w-full bg-green-500 text-white hover:bg-green-600">
                    Tambah Pelanggan
                </Button>
            </div>

            {showCreate && (
                <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Create Customer</h2>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowCreate(false)}
                            >
                                <X />
                            </Button>
                        </div>

                        <form onSubmit={createHandler} className="space-y-3">
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Nama Pelanggan"
                                value={newCustomer.nama_pelanggan}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        nama_pelanggan: e.target.value,
                                    })
                                }
                                required
                            />

                            {/* DOB */}
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between font-normal"
                                    >
                                        {date
                                            ? date.toLocaleDateString("id-ID")
                                            : "Tanggal Lahir"}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        selected={date}
                                        onSelect={(selectedDate) => {
                                            if (!selectedDate) return;

                                            const localDate =
                                                selectedDate.toLocaleDateString("en-CA");

                                            setNewCustomer({
                                                ...newCustomer,
                                                dob: localDate,
                                            });

                                            setDate(selectedDate);
                                            setOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>

                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Email"
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />

                            <input
                                className="w-full border p-2 rounded"
                                placeholder="No Telepon"
                                value={newCustomer.no_telephon}
                                onChange={(e) =>
                                    setNewCustomer({
                                        ...newCustomer,
                                        no_telephon: e.target.value,
                                    })
                                }
                                required
                            />

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreate(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUpdate && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Update Customer</h2>

                        <form
                            onSubmit={(e) => updateHandler(e)}
                            className="space-y-3"
                        >
                            <div>
                                <p className="font-semibold">Nama Pelanggan</p>

                                <input
                                    className="w-full border p-2 rounded mt-2"
                                    value={selectedCustomer.nama_pelanggan}
                                    onChange={(e) =>
                                        setSelectedCustomer({
                                            ...selectedCustomer,
                                            nama_pelanggan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <p className="font-semibold">Tanggal Lahir</p>

                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-full justify-between font-normal cursor-pointer mt-2"
                                        >
                                            {date ? date.toLocaleDateString() : formatDateDDMMYYYY(selectedCustomer.dob)}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                if (!date) return;

                                                const localDate = date.toLocaleDateString("en-CA");

                                                setSelectedCustomer({
                                                    ...selectedCustomer,
                                                    dob: localDate,
                                                });

                                                setDate(date);
                                                setOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <p className="font-semibold">Email</p>

                                <input
                                    className="w-full border p-2 rounded mt-2"
                                    value={selectedCustomer.email}
                                    onChange={(e) =>
                                        setSelectedCustomer({
                                            ...selectedCustomer,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <p className="font-semibold">No Telephon</p>

                                <input
                                    className="w-full border p-2 rounded mt-2"
                                    value={selectedCustomer.no_telephon}
                                    onChange={(e) =>
                                        setSelectedCustomer({
                                            ...selectedCustomer,
                                            no_telephon: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowUpdate(false)}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" className="cursor-pointer bg-green-500 hover:bg-green-600 transition-all">Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDelete && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-80 text-center">
                        <h2 className="text-lg font-bold mb-4">
                            Hapus Customer?
                        </h2>

                        <p className="text-sm mb-4">
                            {selectedCustomer.nama_pelanggan}
                        </p>

                        <div className="flex justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDelete(false)}
                            >
                                Batal
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => deleteHandler(selectedCustomer.id_pelanggan)}
                            >
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {notification.visible && (
                <div
                    className={`flex items-center gap-2 fixed bottom-15 right-5 z-50 px-4 py-3 rounded-md shadow-lg text-white transition-all
            ${notification.type === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                >
                    {notification.type === "success" ? <Check /> : <X />}
                    {notification.message}
                </div>
            )}
        </div>
    )
}

export default CustomersEmployee