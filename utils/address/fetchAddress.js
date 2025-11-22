
const fetchAddressFromPincode = async (pincode) => {
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    if (data[0].Status === "Success") {
      return data[0].PostOffice.map((office) => ({
        // name: office.Name,  
        city: office.District,
        state: office.State,
        country: office.Country,
      }));
    } else {
      return [];
    }
    } catch (error) {
        console.error("Error fetching address:", error);    
        return [];
    }
};

export default fetchAddressFromPincode;