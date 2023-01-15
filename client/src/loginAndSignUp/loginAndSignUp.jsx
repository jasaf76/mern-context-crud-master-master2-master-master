import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import { useRouter } from "next/router";
//INTERNALIMPORT
import Style from "./loginAndSignUp.module.css";
import images from "../img";
//import { Button } from "../components/componentsindex.js";
import axios from "axios";

const loginAndSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [activeBtn, setActiveBtn] = useState(1);
  const router = useRouter();
  const btnName = router.pathname === "/signUp" ? " Registrieren" : "Einloggen";
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const { currentAccount, connectWallet, openError } = useContext(
    NFTMarketplaceContext
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  const registerUser = async (email, password, passwordConfirmed, name) => {
    try {
      const response = await axios.post(
        "http://localhost:3033/api/v1/users/signup",
        {
          email,
          password,
          passwordConfirmed,
          name,
        }
      );
      console.log(response.data.status);
      if (response.data.status === "Success") {
        localStorage.setItem("token", response.data.token);

        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };
  async function loginUser() {
   // 
    try {
      const response = await axios.post(
        "http://localhost:3033/api/v1/users/login",
        { email, password }
      );
      console.log(response.data.status);
      if (response.data.status === "Success") {
        //setIsLoggedIn(true);
        localStorage.setItem("token", response.data.token);
        connectWallet();
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const valueChangeName = (e) => {
    setName(e.target.value);
  };
  const valueChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const valueChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const valueChangePasswordConfirmed = (e) => {
    setPasswordConfirmed(e.target.value);
  };
  const socialImage = [
    {
      social: images.facebook,
      name: "Weiter mitFacebook",
    },
    {
      social: images.twitter,
      name: "Weiter mit twitter",
    },
    {
      social: images.google,
      name: "Weiter mit Google",
    },
  ];
  function handleClick() {
    if (router.pathname === "/signUp") {
      registerUser(email, password, passwordConfirmed, name);
    } else {
      loginUser(email, password);
    }
  }

  return (
    <div className={Style.user}>
      <div className={Style.user_box}>
        <div className={Style.user_box_social}>
          {socialImage.map((el, i) => (
            <div
              key={i + 1}
              onClick={() => setActiveBtn(i + 1)}
              className={`${Style.user_box_social_item} ${
                activeBtn == i + 1 ? Style.active : ""
              }`}>
              <Image
                src={el.social}
                alt={el.name}
                width={30}
                height={30}
                className={Style.user_box_social_item_img}
              />
              <p>
                <span>{el.name}</span>
              </p>
            </div>
          ))}
        </div>
        <p className={Style.user_box_or}>OR</p>
        {router.pathname === "/signUp" ? (
          <div className={Style.user_box_input}>
            <div className={Style.user_box_input_box}>
              <label htmlFor="name">name</label>
              <input
                type="text"
                placeholder="jose aparicio"
                value={name}
                onChange={valueChangeName}
              />
            </div>

            <div className={Style.user_box_input_box}>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                placeholder="example@emample.com"
                value={email}
                onChange={valueChangeEmail}
              />
            </div>
            <div className={Style.user_box_input_box}>
              <label
                htmlFor="password"
                className={Style.user_box_input_box_label}>
                <p>Password</p>
                <p>
                  <a href="#">Forget password</a>
                </p>
              </label>
              <input
                type="password"
                value={password}
                onChange={valueChangePassword}
              />
            </div>
            <div className={Style.user_box_input_box}>
              <label
                htmlFor="passwordConfirmed"
                className={Style.user_box_input_box_label}>
                <p>Password Verifizieren </p>
              </label>
              <input
                type="password"
                value={passwordConfirmed}
                onChange={valueChangePasswordConfirmed}
              />
            </div>
            <div className={Style.box}>
              <button
                btnName={btnName}
                onClick={handleClick}
                className={`${Style.button}`}>
                {btnName}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={Style.user_box_input_box}>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                placeholder="example@emample.com"
                value={email}
                onChange={valueChangeEmail}
              />
            </div>
            <div className={Style.user_box_input_box}>
              <label
                htmlFor="password"
                className={Style.user_box_input_box_label}>
                <p>Password</p>
                <p>
                  <a href="#">Forget password</a>
                </p>
              </label>
              <input
                type="password"
                value={password}
                onChange={valueChangePassword}
              />
            </div>
            <div className={Style.box}>
              <button
                btnName={btnName}
                onClick={handleClick}
                className={`${Style.button}`}>
                {btnName}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default loginAndSignUp;
