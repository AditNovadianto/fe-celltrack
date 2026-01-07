import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "@/utils/auth";
import jsPDF from "jspdf";

type ServiceRequest = {
    kode_service: string;
    status: string;
    harga: number;
    status_pembayaran: string;
    keterangan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
};

const DashboardCustomer = () => {
    const [customer, setCustomer] = useState<{ id_pelanggan: number, nama_pelanggan: string, email: string, dob: string, no_telephon: string }>()
    const [serviceRequest, setServiceRequest] = useState<ServiceRequest>()
    const [showPayment, setShowPayment] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [selectedBank, setSelectedBank] = useState("");
    const [vaNumber, setVaNumber] = useState(null);
    const [expiredAt, setExpiredAt] = useState("");
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/")
        }

    }, [])

    useEffect(() => {
        const user = localStorage.getItem("user");
        const userObj = JSON.parse(user || "{}");

        const serviceRequest = localStorage.getItem("serviceRequest")
        const serviceRequestObj = JSON.parse(serviceRequest || "{}")

        if (user && serviceRequest) {
            setCustomer(userObj)
            setServiceRequest(serviceRequestObj)
        }
    }, [])

    const statusMap: Record<string, { label: string; color: string }> = {
        PENDING: {
            label: "Menunggu Teknisi Mengerjakan",
            color: "bg-yellow-100 text-yellow-800",
        },
        "ON PROGRESS": {
            label: "Sedang Dikerjakan",
            color: "bg-blue-100 text-blue-800",
        },
        DONE: {
            label: "Selesai",
            color: "bg-green-100 text-green-800",
        },
        CANCELED: {
            label: "Dibatalkan",
            color: "bg-red-100 text-red-800",
        },
    };

    const paymentStatusMap: Record<string, string> = {
        UNPAID: "Belum Dibayar",
        PAID: "Sudah Dibayar",
        CANCELED: "Dibatalkan",
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return "-";

        const date = new Date(isoString);

        return date.toLocaleDateString("id-ID", {
            timeZone: "UTC", // ⬅️ KUNCI UTAMA
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const createVirtualAccountHandler = async () => {
        try {
            setIsPaying(true)

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/create-va`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    kode_service: serviceRequest?.kode_service,
                    amount: serviceRequest?.harga,
                    bank: selectedBank
                }),
            })

            if (!response.ok) {
                throw new Error("Create Virtual Account gagal")
            }

            const data = await response.json()

            console.log("Virtual Account", data)

            setVaNumber(data.VA.va_number)
            setExpiredAt(data.VA.expiry_time);

            setShowPayment(false);
            setIsPaying(false);
            setSelectedBank("");
        } catch (error) {
            console.error(error)
        }
    }

    const refreshPaymentHandler = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getServiceRequestById`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    kode_service: serviceRequest?.kode_service,
                }),
            })

            console.log(response)

            if (!response.ok) {
                throw new Error("Get Service Request By Id gagal")
            }

            const data = await response.json()

            setServiceRequest(data[0])

            if (data[0].status_pembayaran === "PAID") {
                setVaNumber(null); // tutup modal VA
                setShowRating(true); // munculin rating
            }
        } catch (error) {
            console.error(error)
        }
    }

    const submitFeedbackHandler = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/submitFeedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id_pelanggan: customer?.id_pelanggan,
                    name: customer?.nama_pelanggan,
                    email: customer?.email,
                    message: feedback,
                    rating: rating
                }),
            })

            console.log(response)

            if (!response.ok) {
                throw new Error("Submit Feedback gagal")
            }

            setShowRating(false);
            setRating(0);
            setFeedback("");
        } catch (error) {
            console.error(error)
        }
    }

    const generateBillHandler = () => {
        const doc = new jsPDF();

        // ===============================
        // HEADER
        // ===============================
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);

        // Judul Tengah
        doc.text("BILL PEMBAYARAN", doc.internal.pageSize.getWidth() / 2, 25, {
            align: "center",
        });

        // Sub-title / Brand
        doc.setFontSize(12);
        doc.text("CellTrack", doc.internal.pageSize.getWidth() / 2, 33, {
            align: "center",
        });

        // Garis pemisah
        doc.setLineWidth(0.5);
        doc.line(20, 38, 190, 38);

        // ===============================
        // DETAIL PELANGGAN
        // ===============================
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");

        let y = 50;

        doc.text("Detail Pelanggan", 20, y);
        y += 8;

        doc.text(`Nama          : ${customer?.nama_pelanggan}`, 20, y);
        y += 7;

        doc.text(`Email         : ${customer?.email}`, 20, y);
        y += 7;

        doc.text(`Kode Service  : ${serviceRequest?.kode_service}`, 20, y);
        y += 7;

        doc.text(
            `Tanggal       : ${new Date().toLocaleDateString("id-ID")}`,
            20,
            y
        );

        // ===============================
        // GARIS
        // ===============================
        y += 10;
        doc.line(20, y, 190, y);

        // ===============================
        // DETAIL PEMBAYARAN
        // ===============================
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Detail Pembayaran", 20, y);

        y += 8;
        doc.setFont("helvetica", "normal");
        doc.text(
            `Total Bayar   : Rp ${Number(serviceRequest?.harga).toLocaleString(
                "id-ID"
            )}`,
            20,
            y
        );

        y += 7;
        doc.text("Status        : PAID", 20, y);

        // ===============================
        // FOOTER
        // ===============================
        y += 20;
        doc.line(20, y, 190, y);

        y += 10;
        doc.setFontSize(10);
        doc.text(
            "Terima kasih telah menggunakan layanan CellTrack.",
            doc.internal.pageSize.getWidth() / 2,
            y,
            { align: "center" }
        );

        y += 6;
        doc.text(
            "Dokumen ini dibuat secara otomatis oleh sistem.",
            doc.internal.pageSize.getWidth() / 2,
            y,
            { align: "center" }
        );

        // ===============================
        // SAVE
        // ===============================
        doc.save(`Bill-${serviceRequest?.kode_service}.pdf`);
    };

    console.log(vaNumber)

    return (
        <div className="max-h-screen overflow-y-auto bg-gray-100 p-5 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Selamat datang,</p>
                    <h1 className="text-lg font-semibold">
                        {customer?.nama_pelanggan}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Kode Service:{" "}
                        <span className="font-mono break-all">
                            {serviceRequest?.kode_service}
                        </span>
                    </p>
                </div>
            </div>

            {/* Status Service */}
            <div
                className={`rounded-xl p-5 ${statusMap[serviceRequest?.status || ""]?.color ||
                    "bg-gray-200 text-gray-700"
                    }`}
            >
                <p className="text-sm">Status Service</p>
                <h2 className="text-xl font-semibold">
                    {statusMap[serviceRequest?.status || ""]?.label || "-"}
                </h2>
            </div>

            {/* Pembayaran */}
            <div className={`${serviceRequest?.status_pembayaran === "UNPAID" || serviceRequest?.status_pembayaran === "PENDING" ? "bg-red-100" : "bg-green-100"} transition-all rounded-xl shadow p-5`}>
                <h3 className="font-semibold mb-3">Pembayaran</h3>

                <p className="text-2xl font-bold mb-1">
                    Rp{" "}
                    {Number(serviceRequest?.harga || 0).toLocaleString("id-ID")}
                </p>

                <p className="text-sm text-gray-500 mb-3">
                    Status:{" "}
                    {paymentStatusMap[serviceRequest?.status_pembayaran || ""] || "-"}
                </p>

                {serviceRequest?.status_pembayaran === "UNPAID" && (
                    <Button onClick={() => setShowPayment(true)} disabled={serviceRequest.status !== "DONE" ? true : false} className="w-full bg-green-500 hover:bg-green-600 transition-all cursor-pointer">
                        Bayar Sekarang
                    </Button>
                )}

                {serviceRequest?.status_pembayaran === "PAID" && (
                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer"
                        onClick={generateBillHandler}
                    >
                        Download Bill
                    </Button>
                )}
            </div>

            {/* Detail Service */}
            <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold mb-3">Detail Service</h3>

                <div className="space-y-2 text-sm">
                    <p>
                        <b>Keluhan:</b> {serviceRequest?.keterangan}
                    </p>
                    <p>
                        <b>Tanggal Masuk:</b>{" "}
                        {formatDate(serviceRequest?.tanggal_mulai || "")}
                    </p>
                    <p>
                        <b>Estimasi Selesai:</b>{" "}
                        {formatDate(serviceRequest?.tanggal_selesai || "")}
                    </p>
                </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold mb-3">Progress</h3>

                <ul className="space-y-2 text-sm">
                    <li>✔️ Request diterima</li>
                    <li
                        className={
                            serviceRequest?.status === "ON_PROGRESS"
                                ? "font-semibold"
                                : ""
                        }
                    >
                        🔧 Sedang dikerjakan
                    </li>
                    <li>💰 Menunggu pembayaran</li>
                    <li>🏁 Selesai</li>
                </ul>
            </div>

            {/* Bantuan */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm">
                <p className="font-medium mb-1">Butuh bantuan?</p>
                <p>
                    Hubungi kami via WhatsApp <b>08xxxxxxxx</b> dengan
                    menyebutkan <b>Kode Service</b>.
                </p>
            </div>

            {showPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Konfirmasi Pembayaran</h2>

                        <div className="text-sm space-y-2">
                            <p>
                                <b>Kode Service:</b>{" "}
                                <span className="font-mono break-all">
                                    {serviceRequest?.kode_service}
                                </span>
                            </p>

                            <p className="text-sm text-gray-500">Total Pembayaran</p>
                            <p className="text-2xl font-bold">
                                Rp {Number(serviceRequest?.harga || 0).toLocaleString("id-ID")}
                            </p>
                        </div>

                        {/* PILIH BANK */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pilih Bank (Virtual Account)</label>
                            <select
                                className="w-full border rounded-lg p-2"
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                            >
                                <option value="">-- Pilih Bank --</option>
                                <option value="BCA">BCA</option>
                                <option value="BNI">BNI</option>
                                <option value="BRI">BRI</option>
                                <option value="MANDIRI">Mandiri</option>
                            </select>
                        </div>

                        {/* VA HASIL GENERATE */}
                        {vaNumber && (
                            <div className="bg-green-50 border border-green-200 p-3 rounded text-sm space-y-1">
                                <p className="font-semibold">Virtual Account {selectedBank}</p>
                                <p className="font-mono text-lg">{vaNumber}</p>
                                <p className="text-xs text-gray-500">
                                    Silakan lakukan pembayaran sebelum 24 jam.
                                </p>
                            </div>
                        )}

                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
                            Pastikan data sudah benar sebelum melanjutkan pembayaran.
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer bg-gray-100"
                                onClick={() => {
                                    setShowPayment(false);
                                    setVaNumber(null);
                                    setSelectedBank("");
                                }}
                            >
                                Batal
                            </Button>

                            <Button
                                className="w-full bg-green-500 hover:bg-green-600 transition-all cursor-pointer"
                                disabled={isPaying || !selectedBank}
                                onClick={() => createVirtualAccountHandler()}
                            >
                                {isPaying ? "Memproses..." : "Bayar Sekarang"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* JIKA VA SUDAH ADA */}
            {vaNumber && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
                        <div className={`${serviceRequest?.status_pembayaran === "UNPAID" || serviceRequest?.status_pembayaran === "PENDING" ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"} transition-all border rounded-lg p-4 text-sm`}>
                            <p className={`${serviceRequest?.status_pembayaran === "UNPAID" || serviceRequest?.status_pembayaran === "PENDING" ? "text-blue-700" : "text-green-700"} transition-all font-semibold`}>
                                Status: {serviceRequest?.status_pembayaran === "UNPAID" || serviceRequest?.status_pembayaran === "PENDING" ? "Menunggu Pembayaran" : "Pembayaran Berhasil"}
                            </p>
                        </div>

                        <div className="border rounded-lg p-4 space-y-2">
                            <p className="text-sm text-gray-500">
                                Virtual Account {selectedBank}
                            </p>
                            <p className="text-2xl font-mono font-bold tracking-wider">
                                {vaNumber}
                            </p>

                            <div className="flex justify-between text-sm pt-2">
                                <span>Total</span>
                                <span className="font-semibold">
                                    Rp {Number(serviceRequest?.harga || 0).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Berlaku hingga</span>
                                <span>{expiredAt}</span>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs">
                            Silakan lakukan pembayaran melalui ATM / Mobile Banking / Internet Banking
                            sesuai dengan bank yang dipilih.
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                className="w-full bg-yellow-500"
                                onClick={() => {
                                    navigator.clipboard.writeText(vaNumber);
                                }}
                            >
                                Salin VA
                            </Button>

                            <Button className="w-full bg-green-500" onClick={() => refreshPaymentHandler()}>
                                Refresh Pembayaran
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setVaNumber(null)}
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showRating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Beri Penilaian</h2>

                        {/* RATING */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Rating</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* FEEDBACK */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Feedback</label>
                            <textarea
                                className="w-full border rounded-lg p-2 text-sm"
                                rows={4}
                                placeholder="Ceritakan pengalaman Anda..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer"
                                onClick={() => setShowRating(false)}
                            >
                                Lewati
                            </Button>

                            <Button
                                className="w-full bg-green-500 hover:bg-green-700 transition-all cursor-pointer"
                                disabled={rating === 0}
                                onClick={() => submitFeedbackHandler()}
                            >
                                Kirim
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardCustomer;
