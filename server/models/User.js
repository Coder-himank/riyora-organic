import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'guest'], default: 'customer' },
  password: { type: String },
  addresses: [
    {
      label: { type: String, required: true, default: "home" },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true }
    }
  ],
  cartData: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity_demanded: { type: Number, required: true, min: 1 },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  wishlistData: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  orderHistory: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
      status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], required: true },
      totalAmount: { type: Number, required: true },
      placedOn: { type: Date, default: Date.now }
    }
  ],
  preferences: {
    receiveMarketingEmails: { type: Boolean, default: true },
    receivePushNotifications: { type: Boolean, default: true }
  },
  failedLoginAttempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
  referralCode: { type: String },
  loyaltyPoints: { type: Number, default: 0 }
}, { timestamps: true });

// Password hashing before saving user
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
