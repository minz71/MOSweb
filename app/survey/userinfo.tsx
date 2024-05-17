"use client";
import React from "react";
import "./userinfo.css";
import Button from "../components/button";
import { useRouter } from "next/navigation";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

const options = [
  { value: 5, label: "精通（聽 / 說 / 讀 / 寫 皆能運用自如）" },
  { value: 4, label: "流利（日常時間都以閩南語進行溝通）" },
  {
    value: 3,
    label: "熟悉（需要使用閩南語的場合能夠正常進行溝通）",
  },
  { value: 2, label: "略懂（僅能理解及透過隻字片語進行溝通）" },
  { value: 1, label: "陌生（幾乎聽不懂閩南語）" },
];
interface State extends SnackbarOrigin {
  open: boolean;
}
const UserInfo: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [familiarity, setFamiliarity] = React.useState(0);
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    localStorage.setItem("userName", event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    localStorage.setItem("email", event.target.value);
  };

  const handleFamiliarityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFamiliarity(Number(event.target.value));
    localStorage.setItem("familiarity", event.target.value);
  };

  const checkField = () => {
    if (userName === "" || email === "" || familiarity === 0) {
      setState({ ...state, open: true });
    } else {
      router.push("/question");
    }
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="請填寫所有欄位"
        key={vertical + horizontal}
      />
      <div className="container-form ">
        <p className="text">參訪者調查</p>
        <input
          type="text"
          name="text"
          className="input"
          placeholder="姓名"
          onChange={handleNameChange}
        ></input>
        <input
          type="text"
          name="text"
          className="input"
          placeholder="電子信箱"
          onChange={handleEmailChange}
        ></input>
        <div className="container survey-container">
          <form>
            <p className="text">閩南語能力調查</p>
            {options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="radio"
                  value={option.value}
                  onChange={handleFamiliarityChange}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </form>
        </div>
        <div className="btn-div-center">
          <Button text="開始" onClick={checkField} />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
