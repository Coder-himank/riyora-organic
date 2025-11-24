import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import styles from "@/styles/productPage.module.css";

export default function ExpandableSection({ title, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={styles.expandable_section}>
            <h3 onClick={() => setOpen(o => !o)} className={styles.expandable_title}>
                {title} {open ? <FaAngleDown /> : ">"}
            </h3>
            {open && <div className={styles.expandable_content}>{children}</div>}
        </div>
    );
}
