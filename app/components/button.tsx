import React from "react";
import "./button.css";

interface ButtonProps {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  icon,
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
      <div className="text-xl">
        {icon}
        {text}
      </div>
    </button>
  );
};

export default Button;
