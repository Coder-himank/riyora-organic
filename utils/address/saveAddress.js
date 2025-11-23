export   const addNewAddress = async ({session, newAddress, setNewAddress}) => {
  if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.country || !newAddress.pincode) {
    alert("Please fill all address fields.");
    return;
  }

  if (session?.user?.id) {
    try {
      // console.log(newAddress);
      await axios.post(
        "/api/secure/userProfile",
        { userId: session.user.id, address: newAddress },
        { withCredentials: true }
      );

      setNewAddress({ label: "Home", address: "", city: "", state: "", country: "", pincode: "" });

      return true;
    } catch (err) {
      console.error("Failed to add address", err);
      alert("Could not add address. Try again.");
    }
    return false;
  }

  // guest: keep new address in state and close form
  setShowNewAddressForm(false);
};


export default addNewAddress;