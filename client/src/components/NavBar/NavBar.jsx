import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { DiJqueryLogo } from "react-icons/di";
//----IMPORT ICON
import { MdNotifications } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import Link from "next/link";
import { useRouter } from "next/router";
//import loginUser from '../../loginAndSignUp/loginAndSignUp';
//INTERNAL IMPORT
import Style from "./NavBar.module.css";
import { Discover, HelpCenter, Notification, Profile, SideBar } from "./index";
import { Button, Error } from "../componentsindex";
import images from "../../img";

//IMPORT FROM SMART CONTRACT
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NavBar = () => {
  //----USESTATE COMPONNTS
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [isLoggedIn, setIsLogeddIn] = useState(false);
  const router = useRouter();

  // const [accessToken, setAccessToken] = useState();
  // const [isOpen, setIsOpen] = useState(false);

  //ACCEDEMOS AL BOTON Y LE AGREGAMOS EL EVENTO CLICK

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogeddIn(true);
    } else {
      setIsLogeddIn(false);
    }
  }, [isLoggedIn]);

  let timeoutId;
  const closeProfile = () => {
    timeoutId = setTimeout(() => {
      setProfile(false);
    }, 3000);
  };

  const stopCloseProfile = () => {
    clearTimeout(timeoutId);
  };

  const openSideBar = () => {
    if (!openSideMenu) {
      setOpenSideMenu(true);
    } else {
      setOpenSideMenu(false);
    }
  };

  //SMART CONTRACT SECTION
  const { currentAccount, connectWallet, openError } = useContext(
    NFTMarketplaceContext
  );

  return (
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <DiJqueryLogo onClick={() => router.push("/")} />
          </div>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type="text" placeholder="Search NFT" />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div>
        </div>

        {/* //END OF LEFT SECTION */}
        <div className={Style.navbar_container_right}>
          <div
            className={Style.navbar_container_right_discover}
            onMouseOver={() => setDiscover(true)}
            onMouseOut={() => setDiscover(false)}>
            {/* DISCOVER MENU */}
            <p>Discover</p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          {/* HELP CENTER MENU */}
          <div
            className={Style.navbar_container_right_help}
            onMouseOver={() => setHelp(true)}
            onMouseOut={() => setHelp(false)}>
            <p>Help Center</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <HelpCenter />
              </div>
            )}
          </div>

          {/* NOTIFICATION */}
          <div
            className={Style.navbar_container_right_notify}
            onMouseOver={() => setNotification(true)}
            onMouseOut={() => setNotification(false)}>
            <MdNotifications className={Style.notify} />
            {notification && <Notification />}
          </div>

          {/* CREATE BUTTON SECTION */}
          <div className={Style.navbar_container_right_button}>
            {isLoggedIn && currentAccount ? (
              <div>
                <Button
                  btnName="erstellen"
                  handleClick={() => router.push("/uploadNFT")}
                />
              </div>
            ) : (
              <div>
                <Button
                  btnName="login"
                  handleClick={() => router.push("/login")}
                />
              </div>
            )}
          </div>
          {/* USER PROFILE */}

          <div
            className={Style.navbar_container_right_profile_box}
            onMouseOut={closeProfile}
            onMouseLeave={() => setProfile(true)}
            onMouseOver={stopCloseProfile}>
            <div
              className={Style.navbar_container_right_profile}
              onClick={() => setProfile(!profile)}>
              <Image
                src={images.user1}
                alt="Profile"
                width={40}
                height={40}
                className={Style.navbar_container_right_profile}
              />
              {profile && <Profile currentAccount={currentAccount} />}
            </div>
          </div>

          {/* MENU BUTTON */}
          <div>
            <div className={Style.navbar_container_right_menuBtn}>
              <CgMenuRight
                className={Style.menuIcon}
                onClick={() => openSideBar()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SIDBAR CPMPONE/NT */}
      {openSideMenu && (
        <div className={Style.sideBar}>
          <SideBar
            setOpenSideMenu={setOpenSideMenu}
            currentAccount={currentAccount}
            connectWallet={connectWallet}
          />
        </div>
      )}

      {openError && <Error />}
    </div>
  );
};

export default NavBar;
