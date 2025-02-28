import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/router";
import styles from "@/styles/authenticate.module.css";
import Link from "next/link";

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
    const [countryCode, setCountryCode] = useState("IN");

    const router = useRouter();
    const { type: pageType, callback } = router.query;

    useEffect(() => {
        console.log(pageType);

        if (pageType !== "login") {

            setIsLogin(false);
            console.log(true);
        }

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
        setCountryCode(country.countryCode.toUpperCase());
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
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post("/api/verify-otp", { phone: formData.phone, otp: sentOtp, storedOtp: sentOtp });
            if (response.data.success) {
                setUserVerified(true);
                toast.success(t("phone_verified"));
                return true;
            } else {
                toast.error(t("invalid_otp"));
            }
        } catch (error) {
            toast.error(t("otp_verification_failed"));
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isLogin) {
            if (await verifyOtp()) {
                try {
                    const res = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false });
                    if (res?.error) {
                        toast.error(t("invalid_credentials"));
                    } else {
                        toast.success(t("login_success"));
                        setTimeout(() => router.push(callback || "/"), 1500);
                    }
                } catch (error) {
                    toast.error(t("login_failed"));
                }
            }
        } else {
            try {
                if (await verifyOtp()) {
                    const response = await axios.post("/api/auth/signup", { ...formData, phoneVerified: true });
                    toast.success(response.data.message);
                    setIsLogin(true);
                    setLoading(false);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || t("registration_failed"));
            }
        }
        setLoading(false);
    };



    return (
        <div className={styles.auth_container}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <motion.div className={styles.auth_box} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2>{isLogin ? t("login") : t("sign_up")}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {!isLogin && <input type="text" name="fullName" placeholder={t("full_name")} value={formData.fullName} onChange={handleChange} required />}
                    <input type="email" name="email" placeholder={t("email")} value={formData.email} onChange={handleChange} required />
                    {!isLogin && <input type="password" name="password" placeholder={t("password")} value={formData.password} onChange={handleChange} required />}
                    <PhoneInput country={countryCode.toLowerCase()} value={formData.phone} onChange={handlePhoneChange} inputProps={{ name: "phone", required: true }} />
                    {step === 2 && <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t("authenticate.enter_otp")} required />}
                    <button type="button" onClick={sendOtp} disabled={!canResend}>{canResend ? t("authenticate.resend_otp") : `${t("authenticate.resend_in")} ${resendTimer}s`}</button>
                    <button type="submit" className={styles.btn} disabled={loading}>{loading ? t("loading") : isLogin ? t("login") : t("sign_up")}</button>

                    {!isLogin ?
                        <p>Already Have a Account : <span style={{ color: "green" }} onClick={() => setIsLogin(true)}>{t("login")}</span></p> :
                        <p>Create New Account : <span style={{ color: "green" }} onClick={() => setIsLogin(false)}>{t("signup")}</span></p>
                    }
                </form>

            </motion.div>
        </div>
    );
}

export async function getStaticProps({ locale }) {
    return { props: { ...(await serverSideTranslations(locale, ["common"])) } };
}
