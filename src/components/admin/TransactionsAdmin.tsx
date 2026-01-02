import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import profilePicture from "../../images/profile-picture.png"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "@/utils/auth"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { Bell, Eye, X } from "lucide-react"

type TransactionsAdminProps = {
    setSection: (section: string) => void
}

const TransactionsAdmin: React.FC<TransactionsAdminProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number, id_user?: number }>()
    const [transactions, setTransactions] = useState<Array<{ id_transaksi: string, item: { id_produk: string, quantity: string, subtotal: string, total: string }[], tanggal_transaksi: string, quantity: string, subtotal: string, total: string, jenis_transaksi: string }>>()
    const [currentPage, setCurrentPage] = useState(1)
    const [showDetails, setShowDetails] = useState({ id_transaksi: "", visible: false });
    const [notifications, setNotifications] = useState<{ readBy?: { role: string, id: number, readAt?: Date; }[] }[]>([]);

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

    const totalPages = Math.ceil((transactions?.length ?? 0) / ITEMS_PER_PAGE)

    const paginatedTransactions = transactions?.slice(
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
        const getAllTransactions = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllTransactions`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Transactions gagal")
                }

                const data = await response.json()

                setTransactions(data.transactions)
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

        getAllTransactions();
        getAllNotifications();
    }, [])

    console.log("Transactions", transactions)

    function formatDateDDMMYYYY(isoString: string | undefined): string {
        if (!isoString) return "";

        const date = new Date(isoString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }

    return (
        <div className="p-5">
            <div className="flex items-center gap-5 w-full justify-between">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Transactions</BreadcrumbPage>
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
                            <TableHead>Id Transaksi</TableHead>
                            <TableHead>Tanggal Transaksi</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Sub Total</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Jenis Transaksi</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions && paginatedTransactions.map((transaction) => (
                            <TableRow>
                                <TableCell className="font-medium">{transaction.id_transaksi}</TableCell>
                                <TableCell>{formatDateDDMMYYYY(transaction.tanggal_transaksi)}</TableCell>
                                <TableCell>{transaction.quantity}</TableCell>
                                <TableCell>{Number(transaction.subtotal).toLocaleString("id-ID")}</TableCell>
                                <TableCell>{Number(transaction.total).toLocaleString("id-ID")}</TableCell>
                                <TableCell>{transaction.jenis_transaksi}</TableCell>
                                <TableCell>
                                    <Button onClick={() => setShowDetails({ id_transaksi: transaction.id_transaksi, visible: true })} className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600">
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

            {showDetails.visible && (() => {
                const selectedTransaction = transactions?.find(
                    t => t.id_transaksi === showDetails.id_transaksi
                )

                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-105">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold">Transaction Details</h2>

                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setShowDetails({ id_transaksi: "", visible: false })
                                    }
                                >
                                    <X />
                                </Button>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b pb-1">
                                    <span className="text-gray-600">ID Transaksi</span>
                                    <span className="font-semibold">
                                        {selectedTransaction?.id_transaksi}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-1">
                                    <span className="text-gray-600">Tanggal</span>
                                    <span className="font-semibold">
                                        {formatDateDDMMYYYY(
                                            selectedTransaction?.tanggal_transaksi
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-1">
                                    <span className="text-gray-600">Quantity</span>
                                    <span className="font-semibold">
                                        {selectedTransaction?.quantity}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-1">
                                    <span className="text-gray-600">Sub Total</span>
                                    <span className="font-semibold">
                                        Rp{" "}
                                        {Number(
                                            selectedTransaction?.subtotal
                                        ).toLocaleString("id-ID")}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-1">
                                    <span className="text-gray-600">Total</span>
                                    <span className="font-semibold">
                                        Rp{" "}
                                        {Number(
                                            selectedTransaction?.total
                                        ).toLocaleString("id-ID")}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b pb-1">
                                    <span className="text-gray-600">Jenis Transaksi</span>
                                    <span className="px-2 py-0.5 rounded text-xs text-white bg-blue-500">
                                        {selectedTransaction?.jenis_transaksi}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mt-4">
                                <p className="font-semibold mb-2">Item</p>

                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-3 py-2 text-left">
                                                    Produk
                                                </th>
                                                <th className="px-3 py-2 text-right">
                                                    Qty
                                                </th>
                                                <th className="px-3 py-2 text-right">
                                                    Subtotal
                                                </th>
                                                <th className="px-3 py-2 text-right">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {selectedTransaction?.item.map(
                                                (item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-t"
                                                    >
                                                        <td className="px-3 py-2">
                                                            {item.id_produk}
                                                        </td>
                                                        <td className="px-3 py-2 text-right">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-3 py-2 text-right">
                                                            Rp{" "}
                                                            {Number(
                                                                item.subtotal
                                                            ).toLocaleString("id-ID")}
                                                        </td>
                                                        <td className="px-3 py-2 text-right font-semibold">
                                                            Rp{" "}
                                                            {Number(
                                                                item.total
                                                            ).toLocaleString("id-ID")}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end mt-5">
                                <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setShowDetails({ id_transaksi: "", visible: false })
                                    }
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}

export default TransactionsAdmin