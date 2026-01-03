import { Bell, Check, Eye, X } from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "@/utils/auth"
import profilePicture from "../../images/profile-picture.png"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"

type ServiceRequestEmployee = {
    setSection: (section: string) => void
}

const ServiceRequestEmployee: React.FC<ServiceRequestEmployee> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number, id_user?: number }>()
    const [currentPage, setCurrentPage] = useState(1)
    const [notifications, setNotifications] = useState<{ readBy?: { role: string, id: number, readAt?: Date; }[] }[]>([]);
    const [serviceRequests, setServiceRequests] = useState<{ id_service_request?: number, nama_pelanggan?: string, keterangan?: string, tanggal_mulai?: string, tanggal_selesai?: string, status?: string, harga?: string }[]>([])
    const [selectedServiceRequest, setSelectedServiceRequest] = useState<any>(null)
    const [customers, setCustomers] = useState<Array<{ id_pelanggan: number, nama_pelanggan: string, dob: string, email: string, no_telephon: string, id_toko: string }>>()
    const [notification, setNotification] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });
    const [showDetail, setShowDetail] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [formCreate, setFormCreate] = useState({
        nama_pelanggan: "",
        keterangan: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        harga: "",
        status: "PENDING",
        id_pelanggan: "",
    });

    const navigate = useNavigate()

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

    const totalPages = Math.ceil((serviceRequests?.length ?? 0) / ITEMS_PER_PAGE)

    const paginatedServiceRequests = serviceRequests?.slice(
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
        const getAllServiceRequests = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllServiceRequests`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Service Requests gagal")
                }

                const data = await response.json()

                setServiceRequests(data)
            } catch (error) {
                console.error(error)
            }
        }

        const getAllCustomers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllCustomers`, {
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
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllNotifications`, {
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

        getAllServiceRequests();
        getAllCustomers();
        getAllNotifications();
    }, [showDetail, showCreate])

    console.log(serviceRequests)

    const handleCreateServiceRequest = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/createServiceRequest`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(formCreate),
                }
            )

            if (!response.ok) {
                throw new Error("Create Service Request gagal")
            }

            setShowCreate(false)
            setFormCreate({
                nama_pelanggan: "",
                keterangan: "",
                tanggal_mulai: "",
                tanggal_selesai: "",
                harga: "",
                status: "PENDING",
                id_pelanggan: "",
            })

            showNotification("Create Service Request Berhasil", "success")
        } catch (error) {
            console.error(error)
            alert("Gagal membuat Service Request")
        }
    }

    function formatDateDDMMYYYY(isoString: string | undefined): string {
        if (!isoString) return "";

        const date = new Date(isoString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }

    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ visible: true, message, type });

        setTimeout(() => {
            setNotification({ visible: false, message: "", type });
        }, 3000);
    }

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
                                <BreadcrumbPage>Service Request</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex items-center gap-10">
                    <button className="fixed bottom-24 right-5 bg-blue-300 rounded-full p-3 sm:relative sm:bg-transparent sm:p-0 sm:bottom-0 sm:right-0 cursor-pointer" onClick={() => setSection("Notifications")}>
                        <Bell size={30} />

                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-white text-blue-900 sm:bg-blue-500 sm:text-white rounded-full flex items-center justify-center">
                            <p>{notifications.filter((notif) => !notif.readBy?.some((item) => item.id === admin?.id_user && item.role === "USER")).length}</p>
                        </div>
                    </button>

                    <div className="cursor-pointer flex items-center gap-5 bg-blue-100 px-5 py-2 rounded-md">
                        <img className="w-10" src={profilePicture} alt="" />

                        <div>
                            <p className="font-semibold">{admin?.nama_user}</p>

                            <p>{admin?.id_role === 1 ? "Admin" : "User"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id Service Request</TableHead>
                            <TableHead>Nama Pelanggan</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead>Tanggal Mulai</TableHead>
                            <TableHead>Tanggal Selesai</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedServiceRequests && paginatedServiceRequests.map((serviceRequest) => (
                            <TableRow>
                                <TableCell className="font-medium">{serviceRequest.id_service_request}</TableCell>
                                <TableCell>{serviceRequest.nama_pelanggan}</TableCell>
                                <TableCell>{serviceRequest.keterangan}</TableCell>
                                <TableCell>{formatDateDDMMYYYY(serviceRequest.tanggal_mulai)}</TableCell>
                                <TableCell>{formatDateDDMMYYYY(serviceRequest.tanggal_selesai)}</TableCell>
                                <TableCell><span className={`${serviceRequest.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : serviceRequest.status === "ON PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"} px-2 py-1 rounded text-xs`}>{serviceRequest.status}</span></TableCell>
                                <TableCell>{serviceRequest.harga}</TableCell>
                                <TableCell className="space-x-2">
                                    <Button
                                        size="sm"
                                        className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                        onClick={() => {
                                            setSelectedServiceRequest(serviceRequest);

                                            setShowDetail(true);
                                        }}
                                    >
                                        <Eye />
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

            <div className="absolute mb-20 lg:mb-0 bottom-5 w-full left-[50%] transform -translate-x-1/2 px-5">
                <Button onClick={() => setShowCreate(true)} className="cursor-pointer w-full bg-green-500 text-white hover:bg-green-600">
                    Tambah Service Request
                </Button>
            </div>

            {showDetail && selectedServiceRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-150 relative">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">
                                Detail Service Request
                            </h2>

                            <Button
                                variant="destructive"
                                className="text-white"
                                onClick={() => {
                                    setShowDetail(false)
                                    setSelectedServiceRequest(null)
                                }}
                            >
                                <X />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="space-y-5 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">ID</span>
                                <span>{selectedServiceRequest.id_service_request}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-medium">Nama Pelanggan</span>
                                <span>{selectedServiceRequest.nama_pelanggan}</span>
                            </div>

                            <div>
                                <span className="font-medium block mb-1">Keterangan</span>
                                <p className="bg-gray-100 p-2 rounded">
                                    {selectedServiceRequest.keterangan}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium block">Tanggal Mulai</span>
                                    <span>{formatDateDDMMYYYY(selectedServiceRequest.tanggal_mulai)}</span>
                                </div>

                                <div>
                                    <span className="font-medium block">Tanggal Selesai</span>
                                    <span>{formatDateDDMMYYYY(selectedServiceRequest.tanggal_selesai)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-medium">Status</span>
                                <span className={`${selectedServiceRequest.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : selectedServiceRequest.status === "ON PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"} px-2 py-1 rounded text-xs`}>
                                    {selectedServiceRequest.status}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-medium">Harga</span>
                                <span className="font-semibold">
                                    Rp {selectedServiceRequest.harga}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDetail(false)
                                    setSelectedServiceRequest(null)
                                }}
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-150 relative">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">
                                Create Service Request
                            </h2>

                            <Button
                                variant="destructive"
                                className="text-white"
                                onClick={() => setShowCreate(false)}
                            >
                                <X />
                            </Button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4 text-sm">

                            {/* Pelanggan */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Pelanggan
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={formCreate.id_pelanggan}
                                    onChange={(e) => {
                                        const selectedId = e.target.value
                                        const selectedCustomer = customers?.find(
                                            (cust) => String(cust.id_pelanggan) === selectedId
                                        )

                                        setFormCreate({
                                            ...formCreate,
                                            id_pelanggan: selectedId,
                                            nama_pelanggan: selectedCustomer?.nama_pelanggan || "",
                                        })
                                    }}
                                >
                                    <option value="">Pilih Pelanggan</option>
                                    {customers?.map((cust) => (
                                        <option
                                            key={cust.id_pelanggan}
                                            value={cust.id_pelanggan}
                                        >
                                            {cust.nama_pelanggan}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Keterangan */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Keterangan
                                </label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                    value={formCreate.keterangan}
                                    onChange={(e) =>
                                        setFormCreate({
                                            ...formCreate,
                                            keterangan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Tanggal */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border rounded px-3 py-2"
                                        value={formCreate.tanggal_mulai}
                                        onChange={(e) =>
                                            setFormCreate({
                                                ...formCreate,
                                                tanggal_mulai: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border rounded px-3 py-2"
                                        value={formCreate.tanggal_selesai}
                                        onChange={(e) =>
                                            setFormCreate({
                                                ...formCreate,
                                                tanggal_selesai: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Harga */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Masukkan harga"
                                    value={formCreate.harga}
                                    onChange={(e) =>
                                        setFormCreate({
                                            ...formCreate,
                                            harga: e.target.value,
                                        })
                                    }
                                />
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowCreate(false)}
                            >
                                Batal
                            </Button>

                            <Button
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={handleCreateServiceRequest}
                            >
                                Simpan
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {
                notification.visible && (
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
                )
            }
        </div>
    )
}

export default ServiceRequestEmployee