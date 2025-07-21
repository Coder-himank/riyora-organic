import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/UnAuthorizedUser.module.css";

const UnAuthorizedUser = () => {
    const router = useRouter();
    router.push("/authenticate?type=login&callback=" + router.pathname);
    return (
        <div className={styles.unauthorize_container}>
            <div className={styles.msgBox}>
                <Link className="btn" href={`/authenticate?type=login&callback=${router.pathname}`}>
                    Login
                </Link>
                <Link className="btn" href={`/authenticate?type=signup&callback=${router.pathname}`}>
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default UnAuthorizedUser;
