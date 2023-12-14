"use client";
import Link from "next/link";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { Button, Overlay as ToolTip, Popover } from "react-bootstrap";
import { FaBell } from "react-icons/fa6";
import styles from "./page.module.scss";
import { Account, User } from "../../../declares/interfaces";
import FormSignIn from "../Forms/Signin/page";
import useAxios from "axios-hooks";

const cx = classNames.bind(styles);
const ServerPath = process.env.NEXT_PUBLIC_SERVER_API;

const getAccount = () => {
    const item = localStorage.getItem("account");
    if (!item) return undefined;
    return JSON.parse(item);
};

export default function Comp() {
    const [account, setAccount] = useState<Account | undefined>(getAccount());

    const [{ data, loading, error }, refetch] = useAxios<User | undefined>({
        baseURL: ServerPath, // Link server
        url: `/users/${account?.user_id}`, // path param, post payload, ...
    });

    const [user, setUser] = useState<User | undefined>(undefined);
    const [showFormSignin, setShowFormSignin] = useState(false);
    const [formSigninOut, setFormSigninOut] = useState(false);

    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [targetTooltip, setTargetTooltip] = useState(null);
    const userRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (error) {
            console.log(error);
        }
        if (data) {
            console.log(data);
            setUser(data);
        }
    }, [account, data, error]);

    const handle_ShowTooltip = (e: any) => {
        setShowTooltip(!showTooltip);
        setTargetTooltip(e.target);
    };

    const handle_HideTooltip = () => {
        setShowTooltip(false);
        setTargetTooltip(null);
    };

    let timeoutId: string | number | NodeJS.Timeout | undefined;

    const onMouseOver = () => {
        setShowTooltip(true);
        clearTimeout(timeoutId);
    };

    const onMouseOutDelay = () => {
        timeoutId = setTimeout(() => {
            setShowTooltip(false);
        }, 500);
    };

    const handle_ShowFormSignin = () => {
        setShowFormSignin(true);
        setFormSigninOut(false);
    };

    const handle_HideFormSignin = () => {
        setFormSigninOut(true);
        setTimeout(() => {
            setShowFormSignin(false);
        }, 300);
    };

    const handle_Signout = (e: any) => {
        e.preventDefault();

        localStorage.removeItem("account");
        handle_HideTooltip();

        alert("Đã đăng xuất.");
        setUser(undefined);
    };

    return (
        <header className={cx("wraper")}>
            <div className={cx("content")}>
                <div className={cx("logo")}>
                    <Link href={"/"}>
                        <img src="/logo-color.png" alt="logo" draggable="false" />
                    </Link>
                    <span className={cx("name-page")}>Z.Personal</span>
                </div>
                <div className={cx("features")}>
                    {user ? (
                        <>
                            <div className={cx("user")} ref={userRef}>
                                <div className={cx("avatar")} onClick={handle_ShowTooltip}>
                                    <img src={user?.images?.avatar[0]?.url} alt="user-avatar" draggable="false" />
                                </div>
                                <ToolTip show={showTooltip} target={targetTooltip} placement="bottom" container={userRef} containerPadding={20}>
                                    <Popover
                                        id="popover-contained"
                                        className={cx("user-tooltip")}
                                        onMouseOver={onMouseOver}
                                        onMouseOut={onMouseOutDelay}
                                    >
                                        <Popover.Header as="div" className={cx("user-tooltip__header")}>
                                            <Link href={`/${user?.info?.nick_name}`} className={cx("user-tooltip__header-container")}>
                                                <img
                                                    src={user?.images?.avatar[0]?.url}
                                                    alt="avatar"
                                                    className={cx("user-tooltip__header-container--avatar")}
                                                />
                                                <div className={cx("user-tooltip__header-container--body")}>
                                                    <h4>{user?.info?.full_name}</h4>
                                                    <h6>{user?.info?.nick_name}</h6>
                                                </div>
                                            </Link>
                                        </Popover.Header>
                                        <Popover.Body className={cx("user-tooltip__body")}>
                                            <Link href={"#"} className={cx("item")} onClick={() => {}}>
                                                <h6>Bài viết của tôi</h6>
                                            </Link>
                                            <Link href={"#"} className={cx("item")} onClick={() => {}}>
                                                <h6>Viết Blog</h6>
                                            </Link>
                                            <hr />
                                            <Link href={"sign-out-now"} className={cx("item")} onClick={handle_Signout}>
                                                <h6>Đăng xuất</h6>
                                            </Link>
                                        </Popover.Body>
                                    </Popover>
                                </ToolTip>
                                <span className={cx("lastname")}>{user?.info?.last_name}</span>
                            </div>
                            <div className={cx("notify")}>
                                <FaBell />
                            </div>
                            <div className={cx("other-link")}>
                                <Link href={"#"}>
                                    <h6>Trang quảng bá của tôi</h6>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <Button variant="outline-success" onClick={handle_ShowFormSignin}>
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </div>
            {showFormSignin && (
                <>
                    <div className={cx("overlay", { formOut: formSigninOut })} onClick={handle_HideFormSignin}></div>
                    <FormSignIn setUser={setUser} formOut={formSigninOut} setShowForm={handle_HideFormSignin} />
                </>
            )}
        </header>
    );
}
