"use client";
import React from "react";
import "./userinfo.css";
import Button from "../components/button";
import { useRouter } from "next/navigation";
import { message } from "antd";
import axios from "axios";
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

const UserInfo: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [familiarity, setFamiliarity] = React.useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const error = () => {
    messageApi.open({
      type: "error",
      content: "請填寫所有欄位",
      style: {
        marginTop: "5vh",
      },
    });
  };
  const sendingErrorMessage = (errMsg: string) => {
    messageApi.open({
      type: "error",
      content: errMsg,
      style: {
        marginTop: "5vh",
      },
    });
  };

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
      error();
    } else {
      axios
        .post(process.env.NEXT_PUBLIC_API_URL + "/checkUser", {
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("email"),
          Familiarity: Number(localStorage.getItem("familiarity")),
        })
        .then((response) => {
          if (response.status.toString() === "200") router.push("/audioRecorder");
          else sendingErrorMessage("Error");
        })
        .catch((error) => {
          console.error(error);
          sendingErrorMessage(error.response.data.Msg);
        });
    }
  };

  return (
    <div>
      {contextHolder}
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
