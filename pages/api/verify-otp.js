export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  
    const { phone, otp, storedOtp } = req.body; // `storedOtp` should be fetched from DB/session
  
    if (!otp || !storedOtp) return res.status(400).json({ error: "OTP is required" });
  
    if (otp === storedOtp) {
      return res.status(200).json({ success: true, message: "OTP verified successfully!" });
    }
  
    return res.status(400).json({ error: "Invalid OTP" });
  }
  