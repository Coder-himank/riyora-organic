import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.module.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/router";
import "@/styles/authenticate.module.css";

export default function AuthPage() {
    const { t } = useTranslation("common");
    const { data: session } = useSession();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userVerified, setUserVerified] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", phone: "", address: "", city: "", country: "" });
    const [otp, setOtp] = useState("");
    const [sentOtp, setSentOtp] = useState(null);
    const [step, setStep] = useState(1);
    const [resendTimer, setResendTimer] = useState(25);
    const [canResend, setCanResend] = useState(false);
    const [countryCode, setCountryCode] = useState("IN"); // Default country

    const router = useRouter();
    const { type: pageType, callback } = router.query;

    useEffect(() => {
        if (pageType !== "login") setIsLogin(false);
    }, [pageType]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePhoneChange = (value, country) => {
        setFormData({ ...formData, phone: value });
        setCountryCode(country.countryCode.toUpperCase()); // Update country dynamically
    };

    const validatePhone = () => {
        if (!isValidPhoneNumber(formData.phone, countryCode)) {
            toast.error(t("invalid_phone"));
            return false;
        }
        return true;
    };

    const sendOtp = async () => {
        if (!validatePhone()) return;
        setCanResend(false);
        setResendTimer(25);

        try {
            const response = await axios.post("/api/send-otp", { phone: formData.phone, countryCode });
            if (response.data.success) {
                setSentOtp(response.data.otp);
                setStep(2);

                toast.success(t("otp_sent"));
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error(t("otp_send_failed"));
            console.error(error);
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post("/api/verify-otp", { phone: formData.phone, otp: sentOtp, storedOtp: sentOtp });
            if (response.data.success) {
                setUserVerified(true);
                toast.success(t("phone_verified"));
                return true
            } else {
                toast.error(t("invalid_otp"));
            }
        } catch (error) {
            toast.error(t("otp_verification_failed"));
        }
        return false
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isLogin) {
            if (await verifyOtp()) {
                try {
                    console.log(formData);

                    const res = await signIn("credentials", { email: formData.email, redirect: false });
                    if (res?.error) {
                        toast.error(t("invalid_credentials"));
                        console.log(res.error);

                    }
                    else {
                        toast.success(t("login_success"));
                        setTimeout(() => router.push(callback || "/"), 1500);
                    }
                } catch (error) {
                    toast.error(t("login_failed"));
                }
            }
        }
        else {
            try {
                if (await verifyOtp()) {

                    const response = await axios.post("/api/auth/signup", { ...formData, phoneVerified: userVerified });
                    toast.success(response.data.message);
                    setIsLogin(true);
                    // setStep(0)
                    setLoading(false)
                }
            } catch (error) {
                toast.error(error.response?.data?.message || t("registration_failed"));
            }
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <motion.div className="auth-box" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2>{isLogin ? t("login") : t("sign_up")}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input type="text" name="fullName" placeholder={t("full_name")} value={formData.fullName} onChange={handleChange} required />
                    )}
                    <input type="email" name="email" placeholder={t("email")} value={formData.email} onChange={handleChange} required />
                    {!isLogin && (
                        <input type="password" name="password" placeholder={t("password")} value={formData.password} onChange={handleChange} required />
                    )}

                    <PhoneInput
                        country={countryCode.toLowerCase()}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        inputProps={{ name: "phone", required: true }}
                    />

                    {step === 2 && <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t("enter_otp")} required />}

                    <div>
                        {step === 1 && <button type="button" onClick={sendOtp}>{t("send_otp")}</button>}
                        {step === 2 && (
                            <button type="button" onClick={sendOtp} disabled={!canResend}>
                                {canResend ? t("resend_otp") : `${t("resend_in")} ${resendTimer}s`}
                            </button>
                        )}
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? t("loading") : isLogin ? t("login") : t("sign_up")}
                    </button>
                </form>
                <p>Already Have a Account : <span style={{ color: "green" }} onClick={() => setIsLogin(true)}>Login</span></p>
            </motion.div>
        </div>
    );
}

export async function getStaticProps({ locale }) {
    return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
