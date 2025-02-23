import { useState } from "react";

export default function VerifyPhone() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [sentOtp, setSentOtp] = useState(null);
    const [step, setStep] = useState(1);

    const sendOtp = async () => {
        const response = await fetch("/api/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        });

        const data = await response.json();
        if (data.success) {
            setSentOtp(data.otp); // Store OTP for testing (remove in production)
            setStep(2);
        } else {
            console.log(data.error);

            alert(data.error);
        }
    };

    const verifyOtp = async () => {
        const response = await fetch("/api/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, otp, storedOtp: sentOtp }), // Use stored OTP
        });

        const data = await response.json();
        if (data.success) alert("Phone verified successfully!");
        else alert("Invalid OTP");
    };

    return (
        <div>
            {step === 1 ? (
                <>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                    <button onClick={sendOtp}>Send OTP</button>
                </>
            ) : (
                <>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                    <button onClick={verifyOtp}>Verify OTP</button>
                </>
            )}
        </div>
    );
}
