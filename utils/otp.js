
import { toast } from "react-toastify";
import { isValidPhoneNumber } from "libphonenumber-js";
import axios from "axios";


export const validatePhone = (phone, countryCode) => {

    if (!isValidPhoneNumber(phone, countryCode)) {
        toast.error("Invalid phone number. Please enter a valid number.");
        return false;
    }
    return true;
};


export const sendOtp = async (phone, countryCode) => {
    if (!validatePhone(phone, countryCode)) {
        toast.error("Invalid Phone Number")
        return false
    }
    try {
        const response = await axios.post("/api/send-otp", { phone, countryCode });
        if (response.data.success) {
            toast.success("OTP sent successfully!");
            return response.data.otp
        } else {
            toast.error(response.data.error);
        }
    } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
    }
    return false
};

export const verifyOtp = async (phone, countryCode, otp) => {
    try {
        const response = await axios.post("/api/verify-otp", { phone, countryCode, otp });
        if (response.data.success) {
            toast.success("Phone number verified successfully!");
            return true;
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    } catch (error) {
        toast.error("OTP verification failed. Please try again.");
    }
    return false;
};