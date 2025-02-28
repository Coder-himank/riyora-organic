
import Razorpay from "razorpay";
import User from "@/server/models/User";
import Product from "@/server/models/Product";
import Order from "@/server/models/Order";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { userId, products } = req.body;



            // Check if userId is provided
            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            // Fetch the cart items or order data for this user
            const cartItems = await getCartItems(userId, products);

            const final_products = cartItems.map((item, index) => {
                return {
                    imageUrl: item.imageUrl,
                    productId: item._id.toString(),
                    quantity_demanded: item.quantity_demanded,
                    price: item.price
                }
            })

            // If no items found in the cart, return an error
            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ error: "No products found in the cart" });
            }

            // Calculate the total amount from cart items
            const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity_demanded || 0), 0);

            // You can add taxes, discounts, etc., to the totalAmount here
            const finalAmount = (totalAmount + 10).toFixed(2); // Apply additional calculations here
            // Initialize Razorpay instance
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            // Set options for Razorpay order creation
            const options = {
                amount: finalAmount * 100,  // Razorpay expects amount in paise (1 INR = 100 paise)
                currency: "INR",  // Currency for payment
                receipt: `receipt#${Date.now()}`,  // Unique receipt ID using timestamp
                payment_capture: 1,  // Automatically capture payment
            };



            // Create the order using Razorpay
            const user = await User.findById(userId);
            const RazorpayOrder = await razorpay.orders.create(options);

            try {

                const newOrder = await new Order({ orderId: RazorpayOrder.id, userId, amount: finalAmount, products: final_products, customerName: user.name, customerPhone: user.phone, customerEmail: user.email })
                await newOrder.save();
            } catch (error) {
                console.log(error);

            }


            // Return orderId and final amount in the response
            res.status(200).json({ orderId: RazorpayOrder.id, amount: finalAmount, products: cartItems });

        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            console.log("error", error)
            res.status(500).json({ error: "Error creating Razorpay order" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}

// Function to get cart items for a user
async function getCartItems(userId, products) {
    let productIds, allProducts, cartData;


    try {

        // If products are passed from frontend
        if (products && Array.isArray(products)) {
            productIds = products.map(item => item.productId);
            allProducts = await Product.find({ _id: { $in: productIds } });
        }
        // If products are not passed, fetch cart from user data
        else {
            const user = await User.findById(userId);
            cartData = user?.cartData || [];
            productIds = cartData.map(item => item.productId.toString());
            allProducts = await Product.find({ _id: { $in: productIds } });
        }

        // Merge cart data with product details
        const mergedProducts = allProducts.map((product) => {
            const productItem = products ? products.find((p) => p.productId === product._id.toString()) : null;
            const cartItem = cartData ? cartData.find((p) => p.productId.toString() === product._id.toString()) : null;
            return {
                ...product.toObject(),
                quantity_demanded: cartItem ? cartItem.quantity_demanded : productItem.quantity_demanded, // Merge quantity from the cart
            };
        });
        return mergedProducts;
    } catch (error) {
        return []
    }

}
