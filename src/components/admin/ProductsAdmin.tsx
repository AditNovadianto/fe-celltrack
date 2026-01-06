import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import profilePicture from "../../images/profile-picture.png"
import React, { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "@/utils/auth"
import { Bell, Check, Eye, SquarePen, Trash2, UserPen, X } from "lucide-react"

type ProductsAdminProps = {
    setSection: (section: string) => void
}

const ProductsAdmin: React.FC<ProductsAdminProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number, id_user?: number }>()
    const [products, setProducts] = useState<Array<{
        id_produk: number, sku_produk: string, kategori_produk: string, nama_produk: string, harga_beli: number, harga_jual: number, stok: number, approved: boolean
    }>>()
    const [currentPage, setCurrentPage] = useState(1)
    const [employees, setEmployees] = useState<Array<any>>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showAssign, setShowAssign] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [notification, setNotification] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({ visible: false, message: "", type: "success" });
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
        const getAllUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getAllUsers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Users gagal")
                }

                const data = await response.json()

                console.log("Users", data)

                const employees = data.users.filter((user: any) => user.id_role !== 1);

                setEmployees(employees)
            } catch (error) {
                console.error(error)
            }
        }

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

                const products = data.filter((user: any) => user.id_role !== 1);

                setProducts(products)
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

        getAllUsers();
        getAllProducts();
        getAllNotifications();
    }, [showAssign, showUpdate, showDelete])

    console.log("Products", products)

    // Update Product
    const updateProductHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/updateProductById/${selectedProduct.id_produk}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        sku_produk: selectedProduct.sku_produk,
                        kategori_produk: selectedProduct.kategori_produk,
                        nama_produk: selectedProduct.nama_produk,
                        harga_beli: selectedProduct.harga_beli,
                        harga_jual: selectedProduct.harga_jual,
                        stok: selectedProduct.stok,
                        approved: selectedProduct.approved,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Gagal update product");
            }

            setProducts((prev) =>
                prev?.map((p) =>
                    p.id_produk === selectedProduct.id_produk
                        ? selectedProduct
                        : p
                )
            );

            setShowUpdate(false);

            showNotification("Product berhasil diupdate", "success");
        } catch (error) {
            alert("Gagal update product");
            console.error(error);
        }
    };

    const assignProductHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("id Produk", selectedProduct.id_produk)

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/assignProductToEmployee/${selectedProduct.id_produk}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        id_user: selectedProduct.id_user,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Gagal update product");
            }

            setProducts((prev) =>
                prev?.map((p) =>
                    p.id_produk === selectedProduct.id_produk
                        ? selectedProduct
                        : p
                )
            );

            setShowAssign(false);

            showNotification("Product berhasil diupdate", "success");
        } catch (error) {

        }
    }
    // 

    // Delete Product
    const deleteHandler = async (id_produk: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deleteProductById/${id_produk}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            );

            if (response.ok) {
                setProducts((prev) =>
                    prev?.filter(
                        (c) =>
                            c.id_produk !==
                            selectedProduct.id_produk
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
    // 

    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ visible: true, message, type });

        setTimeout(() => {
            setNotification({ visible: false, message: "", type });
        }, 3000);
    }

    console.log(selectedProduct)

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
                                <BreadcrumbPage>Products</BreadcrumbPage>
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

                                            setShowAssign(true);
                                        }}
                                    >
                                        <UserPen />
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowUpdate(true);
                                        }}
                                    >
                                        <SquarePen />
                                    </Button>

                                    <Button
                                        size="sm"
                                        className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                        onClick={() => {
                                            setSelectedProduct(product);
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

            {showDetail && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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

                            {/* Assigned Employee (optional) */}
                            {selectedProduct.id_user && (
                                <div className="flex justify-between border-b pb-1">
                                    <span className="text-gray-600">Assigned To</span>
                                    <span className="font-semibold">
                                        {
                                            employees.find(
                                                (e) => e.id_user === selectedProduct.id_user
                                            )?.nama_user ?? "-"
                                        }
                                    </span>
                                </div>
                            )}
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

            {showAssign && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Assign To Employee</h2>

                        <form onSubmit={assignProductHandler} className="space-y-3">
                            <p className="font-semibold">Employee</p>

                            {employees && employees.length > 0 ? (
                                <select className="w-full border p-2 rounded mt-2" value={selectedProduct?.id_user ?? ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            id_user: e.target.value
                                        })
                                    }>
                                    {employees.map((employee: any) => (
                                        <option key={employee.id_user} value={employee.id_user}>
                                            {employee.nama_user}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p>No employees available</p>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => setShowAssign(false)}
                                >
                                    Cancel
                                </Button>

                                <Button className="cursor-pointer bg-green-500 hover:bg-green-600">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUpdate && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Update Product</h2>

                        <form onSubmit={updateProductHandler} className="space-y-3">
                            <div>
                                <p className="font-semibold">SKU Produk</p>

                                <input
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="SKU Produk"
                                    value={selectedProduct.sku_produk}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            sku_produk: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <p className="font-semibold">Kategori Produk</p>

                                <input
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="Kategori Produk"
                                    value={selectedProduct.kategori_produk}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            kategori_produk: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <p className="font-semibold">Harga Beli</p>

                                <input
                                    type="number"
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="Harga Beli"
                                    value={selectedProduct.harga_beli}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            harga_beli: Number(e.target.value),
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <p className="font-semibold">Harga Jual</p>

                                <input
                                    type="number"
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="Harga Jual"
                                    value={selectedProduct.harga_jual}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            harga_jual: Number(e.target.value),
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <p className="font-semibold">Stok</p>

                                <input
                                    type="number"
                                    className="w-full border p-2 rounded mt-2"
                                    placeholder="Stok"
                                    value={selectedProduct.stok}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            stok: Number(e.target.value),
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <p className="font-semibold">Approved</p>

                                <select
                                    className="w-full border p-2 rounded mt-2"
                                    value={selectedProduct.approved ? "true" : "false"}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            approved: e.target.value === "true",
                                        })
                                    }
                                    required
                                >
                                    <option value="true">Approved</option>
                                    <option value="false">Not Approved</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => setShowUpdate(false)}
                                >
                                    Cancel
                                </Button>

                                <Button className="cursor-pointer bg-green-500 hover:bg-green-600">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div >
            )}

            {
                showDelete && selectedProduct && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-80 text-center">
                            <h2 className="text-lg font-bold mb-4">Hapus Product?</h2>

                            <p className="text-sm mb-4">
                                {selectedProduct.sku_produk}
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
                                    onClick={() => deleteHandler(selectedProduct.id_produk)}
                                >
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                notification.visible && (
                    <div
                        className={`flex items-center gap-2 fixed bottom-5 right-5 z-50 px-4 py-3 rounded-md shadow-lg text-white transition-all
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
        </div >
    )
}

export default ProductsAdmin