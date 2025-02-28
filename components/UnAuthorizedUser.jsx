import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/UnAuthorizedUser.module.css";
import { useTranslation } from "next-i18next";

const UnAuthorizedUser = () => {
    const router = useRouter();
    const { t } = useTranslation("common");

    return (
        <div className={styles.unauthorize_container}>
            <div className={styles.msgBox}>
                <Link className="btn" href={`/authenticate?type=login&callback=${router.pathname}`}>
                    {t("unauthorized.login")}
                </Link>
                <Link className="btn" href={`/authenticate?type=signup&callback=${router.pathname}`}>
                    {t("unauthorized.signup")}
                </Link>
            </div>
        </div>
    );
};

export default UnAuthorizedUser;
