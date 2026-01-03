import { Bell, Eye, X } from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import { useEffect, useState } from "react"
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

type ServiceRequestAdmin = {
    setSection: (section: string) => void
}

const ServiceRequestAdmin: React.FC<ServiceRequestAdmin> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number, id_user?: number }>()
    const [currentPage, setCurrentPage] = useState(1)
    const [notifications, setNotifications] = useState<{ readBy?: { role: string, id: number, readAt?: Date; }[] }[]>([]);
    const [serviceRequests, setServiceRequests] = useState<{ id_service_request?: number, nama_pelanggan?: string, keterangan?: string, tanggal_mulai?: string, tanggal_selesai?: string, status?: string, harga?: string }[]>([])
    const [selectedServiceRequest, setSelectedServiceRequest] = useState<any>(null)
    const [showDetail, setShowDetail] = useState(false);

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
        getAllNotifications();
    }, [showDetail])

    function formatDateDDMMYYYY(isoString: string | undefined): string {
        if (!isoString) return "";

        const date = new Date(isoString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }

    console.log(serviceRequests)

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
        </div>
    )
}

export default ServiceRequestAdmin