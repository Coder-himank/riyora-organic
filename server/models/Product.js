import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  suitableFor: { type: [String], required: true },
  bestFor: { type: [String], required: true },
  scientificName: { type: String },
  otherNames: [{ type: String }],
  howToUse: { type: String, required: true },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String }
  }],
  availableQuantity: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  discountPercentage: { type: Number, min: 0, max: 100 },
  promotionCode: { type: String },
  stockStatus: { type: String, enum: ['in stock', 'out of stock', 'pre-order'], required: true },
  expirationDate: { type: Date },
  tags: [{ type: String }],
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedAt: { type: Date }
}, { timestamps: true });


export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
