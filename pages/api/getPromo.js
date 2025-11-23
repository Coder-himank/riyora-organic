import { setupBase, validateOrigin } from "@/utils/security/secureApi";
import Promocode from "@/server/models/Promocode";
const handler = async (req, res) => {
    
  try {
    const AllowedOrigins = process.env.NEXT_PUBLIC_SITE_URL;    
    validateOrigin(req, AllowedOrigins);
    // Check for the correct HTTP method

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
    // Check for the presence of the Authorization header
    await setupBase(req, res, "promocode", 30, 60);

      const promos = await Promocode.find({active: true}).lean();
      return res.status(200).json(promos);
    } catch (error) {
      console.error('Error fetching promocodes:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default handler;