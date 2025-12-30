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
import { Button } from "../ui/button"
import { Bell, Eye, X } from "lucide-react";

type ProductsEmployeeProps = {
    setSection: (section: string) => void
}

const ProductsEmployee: React.FC<ProductsEmployeeProps> = ({ setSection }) => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number }>();
    const [products, setProducts] = useState<Array<{
        id_produk: number, sku_produk: string, kategori_produk: string, nama_produk: string, harga_beli: number, harga_jual: number, stok: number, approved: boolean
    }>>()
    const [employees, setEmployees] = useState<Array<any>>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showDetail, setShowDetail] = useState(false);
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
                const response = await fetch("http://localhost:3000/getAllUsers", {
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

        getAllUsers();
        getAllProducts();
        getAllNotifications();
    }, [])

    console.log("Products", products)

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
                                <TableCell>
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
        </div>
    )
}

export default ProductsEmployee