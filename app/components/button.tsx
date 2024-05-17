import React from "react";
import "./button.css";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick = () => {},
  disabled = false,
}) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button
      className={`btn ${disabled ? "disabled" : ""}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
