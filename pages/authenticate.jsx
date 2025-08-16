import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/authenticate.module.css";
import { validatePhone } from "@/utils/otp"; // only keeping phone validation here

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
    });
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const [countryCode, setCountryCode] = useState("IN");
    const [sentOtp, setSentOtp] = useState(0)

    const { data: session } = useSession()

    const router = useRouter();
    const { type: pageType, callback } = router.query;

    // Adjust mode based on query param
    useEffect(() => {
        if (pageType !== "login") setIsLogin(false);
        // signOut()
    }, [pageType]);


    useEffect(() => {
        if (session?.user?.id) {
            signOut() // uncomment only if you intentionally want auto-logout
        }
    }, []);


    // Countdown for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePhoneChange = (value, country) => {
        setFormData({ ...formData, phone: value });
        setCountryCode(country.countryCode.toUpperCase());
    };

    const handleSendOtp = async () => {
        if (!validatePhone(formData.phone, countryCode)) {
            toast.error("Invalid phone number");
            return;
        }
        setCanResend(false);
        setResendTimer(25);

        try {
            const res = await axios.post("/api/send-otp", {
                phone: formData.phone,
                countryCode,
            });
            if (res.data.success) {
                toast.success("OTP sent successfully");
                setStep(2);
                setSentOtp(res.data.otp)
            } else {
                toast.error(res.data.message || "Failed to send OTP");
            }
        } catch {
            toast.error("Error sending OTP");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            toast.error("Please enter a valid OTP");
            return false;
        }
        try {
            const res = await axios.post("/api/verify-otp", {
                countryCode,
                phone: formData.phone,
                otp,
            });
            if (res.data.success) {
                toast.success("Phone verified successfully");
                return true;
            } else {
                toast.error(res.data.message || "Invalid OTP");
                return false;
            }
        } catch {
            toast.error("OTP verification failed");
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const otpVerified = await handleVerifyOtp();
        if (!otpVerified) {
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // Login flow
                const res = await signIn("credentials", {
                    countryCode,
                    phone: formData.phone,
                    redirect: false,
                    otp
                });
                console.log(res)
                if (res?.error) {
                    toast.error("Login failed");
                } else {
                    toast.success("Login successful");
                    router.push(callback || "/");
                }
            } else {
                // Sign up flow
                await axios.post("/api/auth/signup", {
                    name: formData.fullName, // match backend field
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                    phoneVerified: true,
                });
                const res = await signIn("credentials", { countryCode, phone: formData.phone, otp, redirect: false });
                console.log(res)

                if (res.ok) {


                    toast.success("Sign up successful");
                    router.push(callback || "/");
                } else {

                    toast.error("Sign up Failed");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.auth_container}>
            <ToastContainer position="top-right" autoClose={3000} />
            <motion.div
                className={styles.auth_box}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.image_wrapper}>
                    <Image
                        src="/images/loginImage.png"
                        alt="Auth page"
                        width={400}
                        height={400}
                    />
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>{isLogin ? "Login" : "Sign Up"}</h3>

                    <div className={styles.formAreaTop}>
                        {!isLogin && (
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        )}

                        <PhoneInput
                            country={countryCode.toLowerCase()}
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            inputProps={{ name: "phone", required: true }}
                            className={styles.phoneInput}
                        />



                        {step === 2 && (
                            <>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    required
                                />
                                {sentOtp}
                            </>
                        )}
                    </div>

                    <div className={styles.formAreaBottom}>
                        <button
                            type="button"
                            className={styles.btn}
                            onClick={handleSendOtp}
                            disabled={!canResend}
                        >
                            {canResend ? "Send OTP" : `Resend in ${resendTimer}s`}
                        </button>

                        {step === 2 && (
                            <button
                                type="submit"
                                className={styles.btn}
                                disabled={loading}
                            >
                                {loading
                                    ? "Loading..."
                                    : isLogin
                                        ? "Login"
                                        : "Sign Up"}
                            </button>
                        )}

                        {!isLogin ? (
                            <p>
                                Already have an account?{" "}
                                <span
                                    style={{ color: "green", cursor: "pointer" }}
                                    onClick={() => {
                                        setIsLogin(true);
                                        setStep(1);
                                    }}
                                >
                                    Login
                                </span>
                            </p>
                        ) : (
                            <p>
                                Create new account?{" "}
                                <span
                                    style={{ color: "green", cursor: "pointer" }}
                                    onClick={() => {
                                        setIsLogin(false);
                                        setStep(1);
                                    }}
                                >
                                    Sign Up
                                </span>
                            </p>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
