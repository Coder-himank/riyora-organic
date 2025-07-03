import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  suitableFor: { type: [String], required: true },
  bestFor: { type: [String], required: true },
  // scientificName: { type: String },
  // otherNames: [{ type: String }],
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String }
  }],

  // ingredientsToUseWith : [{type : String, required : true}],
  note : [{type : String, required : true}],
  timeperiod : {type : String, required : true},

  howToUse: { hair: { type: String, required: true }, skin: { type: String, required: true }, health: { type: String, required: true } },

  benefits: { hair: { type: String, required: true }, skin: { type: String, required: true }, health: { type: String, required: true } },

  availableQuantity: { type: Number, required: true },
  category: [{ type: String, required: true }],
  imageUrl: { type: String },
  discountPercentage: { type: Number, min: 0, max: 100 },
  promotionCode: { type: String },
  stockStatus: { type: String, enum: ['in stock', 'out of stock', 'pre-order'], required: true },
  tags: [{ type: String }],
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedAt: { type: Date }
}, { timestamps: true });


export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
