import { Bell, Check, Eye, RefreshCw, X } from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import { useEffect, useState } from "react";
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
import { Button } from "../ui/button";

type ProductsSupplierProps = {
    setSection: (section: string) => void
}

const ProductsSupplier: React.FC<ProductsSupplierProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_supplier?: string, id_role?: number, id_supplier?: number }>();
    const [notifications, setNotifications] = useState<{ readBy?: { role: string, id: number, readAt?: Date; }[] }[]>([]);
    const [products, setProducts] = useState<Array<{
        id_produk: number, sku_produk: string, kategori_produk: string, nama_produk: string, harga_beli: number, harga_jual: number, stok: number, approved: boolean
    }>>()
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showRestock, setShowRestock] = useState(false)
    const [restockQty, setRestockQty] = useState<number>(0)
    const [error, setError] = useState({ show: false, message: "" })
    const [notification, setNotification] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });
    const [showCreate, setShowCreate] = useState(false)
    const [createForm, setCreateForm] = useState({
        sku_produk: "",
        kategori_produk: "",
        nama_produk: "",
        harga_beli: "",
        harga_jual: "",
        stok: ""
    })

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

    const totalPages = Math.ceil((products?.length ?? 0) / ITEMS_PER_PAGE)

    const paginatedProducts = products?.slice(
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
        if (!admin) return;

        const getAllProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllProducts`, {
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

                const dataForSpesificSupplier = data.filter((item: { id_supplier: number | undefined; }) => item.id_supplier === admin?.id_supplier)

                console.log("Products For Spesific Supplier", dataForSpesificSupplier)

                setProducts(dataForSpesificSupplier)
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

                const dataForSpesificSupplier = data.notifications.filter((item: { id_supplier: number | undefined; }) => item.id_supplier === admin?.id_supplier)

                console.log("Notifications For Spesific Supplier", dataForSpesificSupplier)

                setNotifications(dataForSpesificSupplier)
            } catch (error) {
                console.error(error)
            }
        }

        getAllProducts();
        getAllNotifications();
    }, [admin, restockQty, showCreate])

    const handleRestock = async () => {
        if (!selectedProduct) return

        if (restockQty <= 0) {
            setError({ show: true, message: "Jumlah restock harus lebih dari 0" })
            return
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/reStockProduct`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        id_produk: selectedProduct.id_produk,
                        newStock: restockQty
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Restock gagal")
            }

            showNotification("Restock Product Berhasil", "success");

            setShowRestock(false)
            setRestockQty(0)
            setError({ show: false, message: "" })
        } catch (error) {
            console.error(error)
            alert("Terjadi kesalahan saat restock")
        }
    }

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCreateForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreateProduct = async () => {
        const {
            sku_produk,
            kategori_produk,
            nama_produk,
            harga_beli,
            harga_jual,
            stok
        } = createForm

        if (
            !sku_produk ||
            !kategori_produk ||
            !nama_produk ||
            !harga_beli ||
            !harga_jual ||
            !stok
        ) {
            setError({ show: true, message: "Semua field wajib diisi" })
            return
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/storeProducts`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        ...createForm,
                        harga_beli: harga_beli,
                        harga_jual: harga_jual,
                        stok: stok,
                        approved: 0,
                        id_user: 1,
                        id_supplier: admin?.id_supplier
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Store product gagal")
            }

            const data = await response.json()

            // langsung tambah ke tabel
            setProducts((prev) => prev ? [...prev, data.product] : [data.product])

            setShowCreate(false)
            setError({ show: false, message: "" })
            setCreateForm({
                sku_produk: "",
                kategori_produk: "",
                nama_produk: "",
                harga_beli: "",
                harga_jual: "",
                stok: ""
            })

            showNotification("Store Product Berhasil", "success")
        } catch (error) {
            console.error(error)
            alert("Terjadi kesalahan saat store product")
        }
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
                                <BreadcrumbPage>Products</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex items-center gap-10">
                    <button className="fixed bottom-24 right-5 bg-blue-300 rounded-full p-3 sm:relative sm:bg-transparent sm:p-0 sm:bottom-0 sm:right-0 cursor-pointer" onClick={() => setSection("Notifications")}>
                        <Bell size={30} />

                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-white text-blue-900 sm:bg-blue-500 sm:text-white rounded-full flex items-center justify-center">
                            <p>{notifications.filter((notif) => !notif.readBy?.some((item) => item.id === admin?.id_supplier && item.role === "SUPPLIER")).length}</p>
                        </div>
                    </button>

                    <div className="cursor-pointer flex items-center gap-5 bg-blue-100 px-5 py-2 rounded-md">
                        <img className="w-10" src={profilePicture} alt="" />

                        <div>
                            <p className="font-semibold">{admin?.nama_supplier}</p>

                            <p>Supplier</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id Produk</TableHead>
                            <TableHead>SKU Produk</TableHead>
                            <TableHead>Nama Produk</TableHead>
                            <TableHead>Harga Beli</TableHead>
                            <TableHead>Harga Jual</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Approved</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProducts && paginatedProducts.map((product) => (
                            <TableRow>
                                <TableCell className="font-medium">{product.id_produk}</TableCell>
                                <TableCell>{product.sku_produk}</TableCell>
                                <TableCell>{product.nama_produk}</TableCell>
                                <TableCell>{Number(product.harga_beli).toLocaleString("id-ID")}</TableCell>
                                <TableCell>{Number(product.harga_jual).toLocaleString("id-ID")}</TableCell>
                                <TableCell>{product.stok}</TableCell>
                                <TableCell>{product.approved ? "Approved" : "Not Approved"}</TableCell>
                                <TableCell className="space-x-2">
                                    <Button
                                        size="sm"
                                        className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                        onClick={() => {
                                            setSelectedProduct(product);

                                            setShowDetail(true);
                                        }}
                                    >
                                        <Eye />
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                                        onClick={() => {
                                            setSelectedProduct(product);

                                            setShowRestock(true);
                                        }}
                                    >
                                        <RefreshCw />
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
                    Tambah Produk
                </Button>
            </div>

            {showDetail && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-105">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Product Details</h2>

                            <Button
                                size="icon"
                                variant="destructive"
                                className="cursor-pointer"
                                onClick={() => setShowDetail(false)}
                            >
                                <X />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">ID Produk</span>
                                <span className="font-semibold">{selectedProduct.id_produk}</span>
                            </div>

                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">SKU Produk</span>
                                <span className="font-semibold">{selectedProduct.sku_produk}</span>
                            </div>

                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">Nama Produk</span>
                                <span className="font-semibold">{selectedProduct.nama_produk}</span>
                            </div>

                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">Kategori</span>
                                <span className="font-semibold">{selectedProduct.kategori_produk}</span>
                            </div>

                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">Harga Beli</span>
                                <span className="font-semibold">
                                    Rp {Number(selectedProduct.harga_beli).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">Harga Jual</span>
                                <span className="font-semibold">
                                    Rp {Number(selectedProduct.harga_jual).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">Stok</span>
                                <span className="font-semibold">{selectedProduct.stok}</span>
                            </div>

                            <div className="flex justify-between border-b pb-1">
                                <span className="text-gray-600">Status</span>
                                <span
                                    className={`px-2 py-0.5 rounded text-xs text-white
                                        ${selectedProduct.approved
                                            ? "bg-green-500"
                                            : "bg-yellow-500"
                                        }`}
                                >
                                    {selectedProduct.approved ? "Approved" : "Not Approved"}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-5">
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => setShowDetail(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showRestock && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-105">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Restock Product</h2>

                            <Button
                                size="icon"
                                variant="destructive"
                                className="cursor-pointer"
                                onClick={() => setShowRestock(false)}
                            >
                                <X />
                            </Button>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nama Produk</span>
                                <span className="font-semibold">
                                    {selectedProduct.nama_produk}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">SKU</span>
                                <span className="font-semibold">
                                    {selectedProduct.sku_produk}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Stok Saat Ini</span>
                                <span className="font-semibold">
                                    {selectedProduct.stok}
                                </span>
                            </div>
                        </div>

                        {/* Input Restock */}
                        <div className="mb-5">
                            <label className="text-sm font-medium">
                                Jumlah Restock
                            </label>

                            <input
                                type="number"
                                min={1}
                                className="w-full border rounded px-3 py-2 mt-1"
                                onChange={(e) => setRestockQty(Number(e.target.value))}
                            />

                            {error.show && (
                                <p className="text-red-500">{error.message}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => setShowRestock(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                                onClick={handleRestock}
                            >
                                Restock
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-105">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">Store Product</h2>

                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => setShowCreate(false)}
                            >
                                <X />
                            </Button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="font-medium">SKU Produk</label>
                                <input
                                    name="sku_produk"
                                    value={createForm.sku_produk}
                                    onChange={handleCreateChange}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Kategori Produk</label>
                                <input
                                    name="kategori_produk"
                                    value={createForm.kategori_produk}
                                    onChange={handleCreateChange}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Nama Produk</label>
                                <input
                                    name="nama_produk"
                                    value={createForm.nama_produk}
                                    onChange={handleCreateChange}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-medium">Harga Beli</label>
                                    <input
                                        type="number"
                                        name="harga_beli"
                                        value={createForm.harga_beli}
                                        onChange={handleCreateChange}
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Harga Jual</label>
                                    <input
                                        type="number"
                                        name="harga_jual"
                                        value={createForm.harga_jual}
                                        onChange={handleCreateChange}
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-medium">Stok Awal</label>
                                <input
                                    type="number"
                                    name="stok"
                                    value={createForm.stok}
                                    onChange={handleCreateChange}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowCreate(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="bg-blue-500 text-white hover:bg-blue-600"
                                onClick={handleCreateProduct}
                            >
                                Store Product
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

export default ProductsSupplier