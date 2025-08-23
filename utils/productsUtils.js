import axios from "axios";
export const getProductUrl = async () => {
//   if (!product || !product.id) {
//     throw new Error('Invalid product object');
//   }
  const BASEURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try{
    const response = await axios.get(BASEURL+"/api/getProducts");

    
    if (response.data && response.data.length > 0) {
      return `/products/${response.data[0]._id}`;
    } else {

      console.log(response.data);
      

      return "/";
    }
  }catch (error) {
    console.error("Error fetching product:", error);
    return "/"
}

}
export default getProductUrl;