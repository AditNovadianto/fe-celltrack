import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb"
import profilePicture from "../../images/profile-picture.png"
import { useEffect, useState } from "react"
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

const ProductsAdmin = () => {
    const [admin, setAdmin] = useState<{ nama_user?: string, id_role?: number }>()
    const [products, setProducts] = useState<Array<{ id_produk: number, sku_produk: string, kategori_produk: string, harga_beli: number, harga_jual: number, stok: number, approved: boolean }>>()
    const [currentPage, setCurrentPage] = useState(1)

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

        getAllProducts();
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
                            <TableHead>Id Produk</TableHead>
                            <TableHead>SKU Produk</TableHead>
                            <TableHead>Kategori Produk</TableHead>
                            <TableHead>Harga Beli</TableHead>
                            <TableHead>Harga Jual</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Approved</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProducts && paginatedProducts.map((product) => (
                            <TableRow>
                                <TableCell className="font-medium">{product.id_produk}</TableCell>
                                <TableCell>{product.sku_produk}</TableCell>
                                <TableCell>{product.kategori_produk}</TableCell>
                                <TableCell>{Number(product.harga_beli).toLocaleString("id-ID")}</TableCell>
                                <TableCell>{Number(product.harga_jual).toLocaleString("id-ID")}</TableCell>
                                <TableCell>{product.stok}</TableCell>
                                <TableCell>{product.approved ? "Approved" : "Not Approved"}</TableCell>
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
        </div>
    )
}

export default ProductsAdmin