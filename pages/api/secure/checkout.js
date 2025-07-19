import User from "@/server/models/User";
import connectDB from "@/server/db";
import Product from "@/server/models/Product";
import Order from "@/server/models/Order";
import Razorpay from "razorpay";
const handler = async (req, res) => {
  try {
    await connectDB();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }


    let orderId = null;
    const { userId, products, promoCode } = req.body; // here products are a javacript object, not an array {Id, quantity, }


    if (!userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }



    const calculateFinalAmount = async (products) => {
      return products.reduce((total, product) => {
        return total + product.price * product.quantity_demanded;
      }, 0);
    };

    const fetchProducts = async (productIds, products_object) => {
      // productIds = [id, id, id, ...]
      // products_object = [{id, quantity_demanded}, {id, quantity_demanded}, ...]

      const products = await Product.find({ _id: { $in: productIds } });
      return products.map((product) => {
        // Assuming product is an object with properties: _id, name, imageUrl, price, etc.
        // and products_object is an array of objects with properties: id, quantity_demanded
        // and we are using the id from products_object to find the quantity_demanded
        // for each product in the products array
        // and returning the final object with the required properties
        const pObj = products_object.find((item) => {
          if (item.productId.toString() === product._id.toString()) {
            return true;
          }

        })

        return (
          {

            imageUrl: product.imageUrl,
            productId: product._id.toString(),
            quantity_demanded: parseInt(pObj.quantity_demanded),
            price: product.price,
          }
        )
      });
    };

    const calculateDiscount = async (amount, promoCode) => {
      // Assuming a simple discount calculation based on promoCode
      // You can implement your own logic here
      if (promoCode === "DISCOUNT10") {
        return amount * 0.1; // 10% discount
      }
      return 0; // No discount for other codes
    }

    const productList = products || await User.findById(userId).then((user) => user.cartData) // Assuming this returns an array of product objects with the required properties;

    const ProductsIds = productList.map((item) => item.productId.toString());


    const fetchedProducts = await fetchProducts(ProductsIds, productList); // returns an array of objects with the required properties
    // fetchedProducts = [{imageUrl, productId, quantity_demanded, price}, ...]

    let beforeTaxAmount = await calculateFinalAmount(fetchedProducts); // Assuming fetchedProducts is an array of objects with a price property
    let taxedAmount = beforeTaxAmount * 0.18; // Assuming 18% tax
    let deliveryCharges = 50; // Assuming a fixed delivery charge
    let discount = await calculateDiscount(beforeTaxAmount + taxedAmount, promoCode); // Assuming no discount for now
    let finalAmount = (beforeTaxAmount + taxedAmount + deliveryCharges - discount).toFixed(2); // Final amount after tax, delivery charges, and discount

    const final_products = fetchedProducts.map((product) => {
      return {
        imageUrl: product.imageUrl,
        productId: product.productId,
        quantity: product.quantity_demanded,
        price: product.price,
      }
    })


    return res.status(200).json({ products: final_products, beforeTaxAmount, finalAmount, taxedAmount, deliveryCharges, discount });

  } catch (error) {
    console.error("Error in checkout handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;