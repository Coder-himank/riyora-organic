import Promocode from "@/server/models/Promocode";
import connectDB from "@/server/db";

const increasePromo = async (code) => {
  await connectDB();

  const promocode = await Promocode.findOneAndUpdate(
    { code: code },
    { $inc: { timesUsed: 1 } },  // 👈 increases timesUsed by 1
    { new: true }                // returns updated document
  );

  return promocode;
};

export default increasePromo;
