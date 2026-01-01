import styles from "@/styles/addressForm.module.css";
import { useState } from "react";
import LoadingWheel from "@/components/LoadingWheel";
export default function NewAddressForm({ newAddress, setNewAddress, onSave }) {


    const [fetchingAddress, setFetchingAddress] = useState(false);
    const fetchAddressFromPincode = async (pincode) => {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0].Status === "Success") {
                return data[0].PostOffice.map((office) => ({
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

    const fetchAddressDetails = async (pincode) => {
        setNewAddress(prev => ({ ...prev, pincode }));

        if (pincode.length !== 6) return;
        setFetchingAddress(true);

        const details = await fetchAddressFromPincode(pincode);
        if (details.length > 0) {
            const { city, state, country } = details[0];
            setNewAddress(prev => ({
                ...prev,
                city,
                state,
                country
            }));
            setPincodeError("");
        } else {
            setPincodeError("Invalid Pincode");
        }
        setFetchingAddress(false);
    };


    const [pincodeError, setPincodeError] = useState("");

    return (
        <div className={styles.new_address_form}>

            {/* Label Buttons */}
            <div className={styles.addressLabels}>
                {["Home", "Office", "Other"].map(label => (
                    <button
                        key={label}
                        type="button"
                        className={`${styles.addressLabelBtn} ${newAddress.label === label ? styles.active : ""}`}
                        onClick={() => setNewAddress({ ...newAddress, label })}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Address */}
            <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Address</label>
                <input
                    type="text"
                    value={newAddress.address}
                    onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                    className={styles.fieldInput}
                    placeholder="Enter full address"
                />
            </div>

            <div className={styles.input_tiles}>


                {/* Pincode */}
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Pincode {fetchingAddress && <LoadingWheel />}</label>
                    <input
                        type="text"
                        value={newAddress.pincode}
                        onChange={e => fetchAddressDetails(e.target.value)}
                        className={styles.fieldInput}
                        placeholder="Enter Pincode"
                    />
                    {pincodeError && <p className={styles.fieldError}>{pincodeError}</p>}
                </div>

                {/* City */}
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>City</label>
                    <input
                        type="text"
                        value={newAddress.city}
                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                        className={styles.fieldInput}
                        placeholder="City"
                    />
                </div>

                {/* State */}
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>State</label>
                    <input
                        type="text"
                        value={newAddress.state}
                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                        className={styles.fieldInput}
                        placeholder="State"
                    />
                </div>

                {/* Country */}
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Country</label>
                    <input
                        type="text"
                        value={newAddress.country}
                        onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                        className={styles.fieldInput}
                        placeholder="Country"
                    />
                </div>
            </div>

            {/* {onSave && (
                <button className={styles.primaryBtn} onClick={onSave}>
                    Save address
                </button>
            )} */}

        </div>
    );
}
