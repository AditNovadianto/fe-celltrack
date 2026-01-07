import { useState } from "react";
import { CircleX } from "lucide-react";
import logo from "../images/logo-celltrack.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SignInCustomer = () => {
    const [email, setEmail] = useState("");
    const [kodeService, setKodeService] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email || !kodeService) {
            setError("Email dan Kode Service wajib diisi");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/signInCustomers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        kode_service: kodeService,
                        email: email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                // ambil pesan error dari backend kalau ada
                throw new Error(data?.message || "Sign In gagal");
            }

            sessionStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.customer));
            localStorage.setItem(
                "serviceRequest",
                JSON.stringify(data.serviceRequest[0])
            );

            navigate("/dashboard");
        } catch (error: any) {
            console.error(error);
            setError(error.message || "Gagal melakukan sign in. Silakan coba lagi.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-5 bg-linear-to-t from-sky-950 to-white">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

                {/* Header */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <img src={logo} alt="CellTrack" className="h-14" />
                    <h1 className="text-xl font-semibold text-gray-800">
                        Login Customer
                    </h1>
                    <p className="text-sm text-gray-500 text-center">
                        Masukkan email dan kode service untuk melihat status perbaikan
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        <CircleX size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-x-2 flex flex-col">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="contoh@email.com"
                            className="w-full border px-5 py-2 rounded-lg mt-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-x-2 flex flex-col">
                        <label>Kode Service</label>
                        <input
                            type="text"
                            placeholder="Contoh: a1b2c3d4:9f8e7d"
                            className="w-full border px-5 py-2 rounded-lg mt-2"
                            value={kodeService}
                            onChange={(e) => setKodeService(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Masuk
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-xs text-gray-500 text-center mt-6">
                    Kode service didapat saat Anda melakukan request perbaikan
                </p>
            </div>
        </div>
    );
};

export default SignInCustomer;
