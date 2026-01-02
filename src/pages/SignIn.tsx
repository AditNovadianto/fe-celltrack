import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu"
import { CircleX, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../images/logo-celltrack.png"

const SignIn = () => {
    const [role, setRole] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(true)

    const navigate = useNavigate()

    const signInHandler = async (e: any) => {
        e.preventDefault()

        try {
            const response = await fetch(role === "Admin" || role === "Employee" ? `${import.meta.env.VITE_API_BASE_URL}/signInUsers` : `${import.meta.env.VITE_API_BASE_URL}/signInSuppliers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (!response.ok) {
                throw new Error("Sign In gagal")
            }

            const data = await response.json()

            sessionStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(role === "Admin" || role === "Employee" ? data.user : data.supplier))

            navigate("/dashboard")
        } catch (error) {
            console.error(error)
            setError("Gagal melakukan sign in. Silakan coba lagi.")
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-5 bg-linear-to-t from-sky-950 to-white">
            <img className="absolute top-10 left-10 w-20 cursor-pointer" src={logo} alt="Logo" />

            <div className="w-full md:w-[35%] bg-white shadow-lg rounded-lg p-10">
                <p className="font-semibold text-xl text-center">Sign In</p>

                <form className="mt-10 w-full">
                    <div>
                        <label className="block text-base font-semibold" htmlFor="">Choose Roles</label>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full mt-2 cursor-pointer" variant="outline">{role || "Select Role"}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white p-5 rounded-lg shadow-xl w-56">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup className="flex flex-col gap-2" value={role} onValueChange={setRole}>
                                    <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Admin">Admin</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Employee">Employee</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem className="text-black hover:bg-gray-300 transition-all cursor-pointer px-2 py-1" value="Supplier">Supplier</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="w-full mt-5">
                        <label className="block text-base font-semibold" htmlFor="">Email<span className="text-red-500">*</span></label>
                        <input onChange={(e) => setEmail(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type="email" />
                    </div>

                    <div className="w-full mt-5">
                        <label className="block text-base font-semibold" htmlFor="">Password<span className="text-red-500">*</span></label>

                        <div className="relative">
                            <input onChange={(e) => setPassword(e.target.value)} className="w-full border px-5 py-2 rounded-lg mt-2" type={showPassword ? "password" : "text"} />

                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4 cursor-pointer">{showPassword ? <Eye /> : <EyeOff />}</button>
                        </div>

                        <a className="text-sky-950 font-semibold mt-2 flex flex-col items-end" href="/forgot-password">forgot password?</a>
                    </div>

                    <button onClick={(e) => signInHandler(e)} className="w-full bg-sky-950 text-white py-2 rounded-lg mt-5 cursor-pointer">Sign In</button>
                </form>

                <p className="mt-5 text-center">Don't have an account? <a className="underline text-sky-950 font-semibold" href="/signup">Sign Up</a></p>
            </div>

            {error && (
                <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white text-center absolute p-5 rounded-lg shadow-lg">
                        <CircleX className="text-red-500 scale-150 m-auto" />

                        <p className="text-red-500 mt-5 font-semibold text-center">{error}</p>

                        <Button className="w-full mt-5 bg-sky-950 cursor-pointer" onClick={() => setError("")}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SignIn