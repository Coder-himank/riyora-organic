import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,
  name: String,
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    ingredients: {
      type: [String],
      required: [true, 'Please list product ingredients'],
    },
    suitableFor: [{ type: String, required: true }],
    relatedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    price: {
      type: Number,
      required: [true, 'Please set a price'],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    category: [{ type: String, required: true }],
    imageUrl: [{ type: String }],
    discountPercentage: { type: Number, min: 0, max: 100 },
    promotionCode: [{ type: String }],
    tags: [{ type: String }],

    variants: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        stock: Number,
        imageUrl: String,
        quantity: String
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],

    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastModifiedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
export default mongoose.models.Product || mongoose.model('Product', productSchema);
