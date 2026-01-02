import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import profilePicture from "../../images/profile-picture.png"
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
import { Button } from "../ui/button"
import { Bell, Box, Check, Eye, ShoppingCart, X } from "lucide-react";

type Item = {
    id_produk: number | string
    quantity: number
    subtotal: number
    total: number
}

type TransactionsEmployeeProps = {
    setSection: (section: string) => void
}

const TransactionsEmployee: React.FC<TransactionsEmployeeProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number, id_user?: number }>();
    const [transactions, setTransactions] = useState<Array<{ id_transaksi: string, item: { id_produk: string, quantity: string, subtotal: string, total: string }[], tanggal_transaksi: string, quantity: string, subtotal: string, total: string, jenis_transaksi: string }>>()
    const [currentPage, setCurrentPage] = useState(1)
    const [showDetails, setShowDetails] = useState({ id_transaksi: "", visible: false });
    const [showCreate, setShowCreate] = useState(false);
    const [products, setProducts] = useState<Array<{
        id_produk: number, sku_produk: string, kategori_produk: string, nama_produk: string, harga_beli: number, harga_jual: number, stok: number, approved: boolean
    }>>();
    const [customers, setCustomers] = useState<Array<{ id_pelanggan: number, nama_pelanggan: string, dob: string, email: string, no_telephon: string, id_toko: string }>>()
    const [items, setItems] = useState<Item[]>([])
    const [jenisTransaksi, setJenisTransaksi] = useState("cash")
    const [tanggalTransaksi, setTanggalTransaksi] = useState("")
    const [idPelanggan, setIdPelanggan] = useState<number | string>("")
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error"; visible: boolean; }>({
        message: "", type: "success", visible: false
    });
    const [notifications, setNotifications] = useState<{ readBy?: { role: string, id: number, readAt?: Date; }[] }[]>([]);
    const [showCommitTransaction, setShowCommitTransaction] = useState(false)

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

        const getAllProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/getAllProducts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Products gagal")
                }

                const data = await response.json()

                const products = data.filter((user: any) => user.id_role !== 1);

                setProducts(products)
            } catch (error) {
                console.error(error)
            }
        }

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
        getAllTransactions();
        getAllProducts();
        getAllNotifications();
    }, [showCreate, showDetails])

    console.log("Transactions", transactions)

    // Function helper for Format Date
    function formatDateDDMMYYYY(isoString: string | undefined): string {
        if (!isoString) return "";

        const date = new Date(isoString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }
    // 

    // Function Helper for Increase and Decrease Product Quantity Button
    const addItem = (product: any) => {
        setItems([...items, { id_produk: product.id_produk, quantity: 1, subtotal: Number(product.harga_jual), total: 1 * Number(product.harga_jual) }])
    }

    const increaseQuantity = (id_produk: number) => {
        setItems(items.map(item => item.id_produk === id_produk ? { ...item, quantity: Number(item.quantity) + 1, subtotal: Number(item.subtotal), total: Number(item.total) + Number(item.subtotal) } : item))
    }

    const decreaseQuantity = (id_produk: number) => {
        setItems(items.map(item => item.id_produk === id_produk ? { ...item, quantity: Number(item.quantity) - 1, subtotal: Number(item.subtotal), total: Number(item.total) - Number(item.subtotal) } : item))
    }

    console.log(items)
    // 

    // Create Transaction
    const createTransactionHandler = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/createTransaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    item: items,
                    tanggal_transaksi: tanggalTransaksi,
                    quantity: items.reduce((acc, item) => acc + item.quantity, 0),
                    subtotal: items.reduce((acc, item) => acc + item.subtotal, 0),
                    total: items.reduce((acc, item) => acc + item.total, 0),
                    jenis_transaksi: jenisTransaksi || "cash",
                    id_pelanggan: idPelanggan || 1
                })
            })

            if (!response.ok) {
                throw new Error("Get Products gagal")
            }

            setItems([])
            setTanggalTransaksi("")
            setJenisTransaksi("")
            setIdPelanggan("")
            setShowCommitTransaction(false)

            setShowCreate(false)

            showNotification("Customer berhasil ditambahkan", "success");
        } catch (error) {
            console.error(error)
        }
    }
    // 

    // Function Helper for Calculate subtotal and total
    const calculateSubtotal = (id_produk: number, qty: number) => {
        const product = products?.find(p => p.id_produk === id_produk)
        return product ? product.harga_jual * qty : 0
    }

    const totalHarga = items.reduce((total, item) => {
        return total + calculateSubtotal(Number(item.id_produk), item.quantity)
    }, 0)
    // 

    // Generate Bill
    const generateBillFilename = () => {
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
        return `BILL-${randomCode}-${today}`
    }

    const handleGenerateBill = () => {
        const originalTitle = document.title
        const filename = generateBillFilename()

        document.title = filename

        window.print()

        // kembalikan title setelah print
        setTimeout(() => {
            document.title = originalTitle
        }, 500)
    }
    // 

    // Notification
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
    // 

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

            <div className="absolute mb-20 lg:mb-0 bottom-5 w-full left-[50%] transform -translate-x-1/2 px-5">
                <Button onClick={() => setShowCreate(true)} className="cursor-pointer w-full bg-green-500 text-white hover:bg-green-600">
                    Tambah Transaksi
                </Button>
            </div>

            {showDetails.visible && (() => {
                const selectedTransaction = transactions?.find(
                    t => t.id_transaksi === showDetails.id_transaksi
                )

                return (
                    <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
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

            {showCreate && (
                <div className="fixed inset-0 bg-black/50 p-5 xl:flex xl:items-center xl:justify-center z-50 overflow-y-auto">
                    <div className="bg-white p-5 rounded-lg w-[90%] lg:w-[80%] m-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Create Transaction</h2>

                            <Button onClick={() => { setShowCreate(false); setItems([]); setJenisTransaksi(""); setTanggalTransaksi(""); }} className="bg-red-500 hover:bg-red-600 transition-all cursor-pointer">
                                <X />
                            </Button>
                        </div>

                        {/* Products List */}
                        <p className="mb-2 font-semibold">Pilih Produk:</p>

                        <div className="flex items-center gap-5 flex-wrap justify-center mt-10">
                            {products && products.map((product, index) => (
                                <div key={index} className={`${product.stok < 5 ? 'bg-red-200' : 'bg-white'} border rounded-md p-2 shadow-2xl`}>
                                    <button onClick={() => addItem(product)} className="transition-all relative cursor-pointer flex flex-col justify-center items-center gap-3 p-3 w-62.5">
                                        <p className={`${product.stok < 5 ? "block" : "hidden"} absolute px-2 py-1 bg-red-500 text-white rounded-full font-semibold top-2 left-2`}>Sisa {product.stok}</p>

                                        <Box size={60} />

                                        <p className="font-semibold text-lg">{product.nama_produk}</p>

                                        <p className="font-semibold">{Number(product.harga_jual).toLocaleString("id-ID")}</p>
                                    </button>

                                    <div className={`${items.find(item => item.id_produk === product.id_produk) ? 'flex' : 'hidden'} items-center gap-3 mt-2 justify-center`}>
                                        <Button onClick={() => items.find(item => item.id_produk === product.id_produk)?.quantity === 1 ? setItems(items.filter(item => item.id_produk !== product.id_produk)) : decreaseQuantity(product.id_produk)} className="cursor-pointer">-</Button>

                                        <p>{items.find(item => item.id_produk === product.id_produk)?.quantity || 0}</p>

                                        <Button onClick={() => increaseQuantity(product.id_produk)} className="cursor-pointer">+</Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tanggal Transaksi */}
                        <div className="mt-10">
                            <p className="font-semibold">Tanggal Transaksi</p>

                            <input type="date" className="border rounded-md w-full mt-2 p-2" value={tanggalTransaksi} onChange={(e) => setTanggalTransaksi(e.target.value)} />
                        </div>

                        {/* Jenis Transaksi */}
                        <div className="mt-5    ">
                            <p className="font-semibold">Jenis Transaksi</p>

                            <select className="border rounded-md w-full mt-2 p-2" value={jenisTransaksi} onChange={(e) => setJenisTransaksi(e.target.value)}>
                                <option value="cash">Cash</option>
                                <option value="credit">Credit</option>
                            </select>
                        </div>

                        {/* Pelanggan */}
                        <div className="mt-5">
                            <p className="font-semibold">Pelanggan</p>

                            <select className="border rounded-md w-full mt-2 p-2" value={idPelanggan} onChange={(e) => setIdPelanggan(e.target.value)}>
                                {customers?.map((customer, index) => (
                                    <option key={index} value={customer.id_pelanggan}>{customer.nama_pelanggan}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-5 flex items-center gap-3 w-full">
                            <Button onClick={() => setShowCommitTransaction(true)} className="flex-1 h-11 bg-green-500 hover:bg-green-600 transition-all cursor-pointer">
                                Submit
                            </Button>

                            <Button size="icon" className="relative h-11 w-11 bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer">
                                <ShoppingCart className="w-5 h-5" />

                                <div className="absolute -top-4 -right-4 bg-blue-500 text-white rounded-full w-9 h-9 text-base flex items-center justify-center">
                                    <p>{items.length}</p>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {showCommitTransaction && (
                        <div className="fixed inset-0 bg-black/50 p-5 xl:flex xl:items-center xl:justify-center z-50 overflow-y-auto">
                            <div className="bg-white p-5 rounded-lg w-[90%] lg:w-[80%] m-auto">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">Konfirmasi Transaksi</h2>

                                    <Button
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={() => setShowCommitTransaction(false)}
                                    >
                                        <X />
                                    </Button>
                                </div>

                                {/* Summary */}
                                <div className="mb-5 text-sm space-y-1">
                                    <p><b>Tanggal:</b> {tanggalTransaksi}</p>
                                    <p><b>Jenis Transaksi:</b> {jenisTransaksi}</p>
                                    <p><b>Pelanggan:</b> {
                                        customers?.find(c => c.id_pelanggan === Number(idPelanggan))?.nama_pelanggan
                                    }</p>
                                </div>

                                {/* Items Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border p-2">Produk</th>
                                                <th className="border p-2">Harga</th>
                                                <th className="border p-2">Qty</th>
                                                <th className="border p-2">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item, index) => {
                                                const product = products?.find(p => p.id_produk === item.id_produk)
                                                return (
                                                    <tr key={index}>
                                                        <td className="border p-2">{product?.nama_produk}</td>
                                                        <td className="border p-2">
                                                            {Number(product?.harga_jual).toLocaleString("id-ID")}
                                                        </td>
                                                        <td className="border p-2 text-center">{item.quantity}</td>
                                                        <td className="border p-2">
                                                            {calculateSubtotal(Number(item.id_produk), item.quantity).toLocaleString("id-ID")}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Total */}
                                <div className="flex justify-end mt-4 text-lg font-bold">
                                    Total: Rp {totalHarga.toLocaleString("id-ID")}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCommitTransaction(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        onClick={() => createTransactionHandler()}
                                        className="bg-green-500 hover:bg-green-600"
                                    >
                                        Commit Transaction
                                    </Button>

                                    {/* Generate Bill */}
                                    <Button
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={handleGenerateBill}
                                    >
                                        Generate Bill
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
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

export default TransactionsEmployee