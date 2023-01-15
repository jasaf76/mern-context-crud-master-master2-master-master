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
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleMouseEnter = (name) => {
    setIsOpen(name)
  }

  const handleMouseLeave = () => {
    setIsOpen(false);
  }

  const openMenu = (e) => {
    const btnText = e.target.innerText;
    if (btnText === "Discover") {
      setDiscover(!discover);
    } else if (btnText === "Help Center") {
      setHelp(!help);
    } else if (btnText === "Notification") {
      setNotification(!notification);
    } else if (btnText === "Profile") {
      setProfile(!profile);
    }
  };

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

        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_container_right_discover}>
            <p onClick={(e) => openMenu(e)} onMouseEnter={() => handleMouseEnter('discover')} onMouseLeave={handleMouseLeave}>Discover</p>
            {isOpen === 'discover' && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_discover}>
            <p onClick={(e) => openMenu(e)} onMouseEnter
