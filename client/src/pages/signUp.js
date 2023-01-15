import React from "react";
import { useRouter } from "next/router";
//INTERNAL IMPORT
import Style from "../styles/login.module.css";
import LoginAndSignUp from "../loginAndSignUp/loginAndSignUp";

const signUp = () => {
  const router = useRouter();
  return (
    <div className={Style.login}>
      <div className={Style.login_box}>
        <h1>SignUp</h1>
        <LoginAndSignUp />
        <p className={Style.login_box_para}>
              
          New user? <a href="/login">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default signUp;
