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
import { X } from "lucide-react"

const TransactionsAdmin = () => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number }>()
    const [transactions, setTransactions] = useState<Array<{ id_transaksi: string, item: { id_produk: string, quantity: string, subtotal: string, total: string }[], tanggal_transaksi: string, quantity: string, subtotal: string, total: string, jenis_transaksi: string }>>()
    const [currentPage, setCurrentPage] = useState(1)
    const [showDetails, setShowDetails] = useState({ id_transaksi: "", visible: false });

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
                const response = await fetch("http://localhost:3000/getAllTransactions", {
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

        getAllTransactions();
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

    console.log(showDetails)

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

                <div className="cursor-pointer flex items-center gap-5 bg-blue-100 px-5 py-2 rounded-md">
                    <img className="w-10" src={profilePicture} alt="" />

                    <div>
                        <p className="font-semibold">{admin?.nama_user}</p>

                        <p>{admin?.id_role === 1 ? "Admin" : "User"}</p>
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
                                    <button onClick={() => setShowDetails({ id_transaksi: transaction.id_transaksi, visible: true })} className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                                        View Details
                                    </button>
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-125">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Transaction Details</h2>

                                <button
                                    onClick={() => setShowDetails({ id_transaksi: "", visible: false })}
                                    className="bg-red-500 cursor-pointer text-white p-2 rounded-md hover:bg-red-600"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 text-sm mb-4">
                                <p>
                                    <span className="font-semibold">Id Transaksi:</span>{" "}
                                    {selectedTransaction?.id_transaksi}
                                </p>

                                <p>
                                    <span className="font-semibold">Tanggal Transaksi:</span>{" "}
                                    {formatDateDDMMYYYY(selectedTransaction?.tanggal_transaksi)}
                                </p>

                                <p>
                                    <span className="font-semibold">Quantity:</span>{" "}
                                    {selectedTransaction?.quantity}
                                </p>

                                <p>
                                    <span className="font-semibold">Sub Total:</span>{" "}
                                    {Number(selectedTransaction?.subtotal).toLocaleString("id-ID")}
                                </p>

                                <p>
                                    <span className="font-semibold">Total:</span>{" "}
                                    {Number(selectedTransaction?.total).toLocaleString("id-ID")}
                                </p>

                                <p>
                                    <span className="font-semibold">Jenis Transaksi:</span>{" "}
                                    {selectedTransaction?.jenis_transaksi}
                                </p>
                            </div>

                            {/* Items Table */}
                            <p className="font-semibold">Item: </p>

                            <div className="mt-2 border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Produk</th>
                                            <th className="px-3 py-2 text-right">Qty</th>
                                            <th className="px-3 py-2 text-right">Subtotal</th>
                                            <th className="px-3 py-2 text-right">Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedTransaction?.item.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="px-3 py-2">
                                                    {item.id_produk}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    {Number(item.subtotal).toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-3 py-2 text-right font-semibold">
                                                    {Number(item.total).toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}

export default TransactionsAdmin