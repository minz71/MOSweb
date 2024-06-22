import React, { useEffect, useState } from "react";
import "./rating.css";

interface Props {
  rate?: number;
  isFixed?: boolean;
  name?: string;
  disabled?: boolean;
  onchange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Rating: React.FC<Props> = ({
  rate = 0,
  isFixed = false,
  name = "rating",
  disabled = false,
  onchange = () => {},
}) => {
  const [selectedRate, setSelectedRate] = useState(rate);

  useEffect(() => {
    setSelectedRate(rate);
  }, [rate]);

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = Number(event.target.value);
    setSelectedRate(newRate);
    if (onchange) {
      onchange(event);
    }
  };

  const stars = [
    { value: 0, title: "隱藏" },
    { value: 1, title: "非常不好" },
    { value: 2, title: "不好" },
    { value: 3, title: "普通" },
    { value: 4, title: "好" },
    { value: 5, title: "非常好" },
  ];

  return (
    <div className={`rating ${disabled ? "disabled" : ""}`}>
      <div className="rating">
        {stars.reverse().map((star, index) => (
          <React.Fragment key={star.value}>
            <input
              type="radio"
              id={`star${star.value}-${index}`}
              name={name}
              checked={selectedRate === star.value}
              value={star.value}
              disabled={isFixed}
              onChange={handleRatingChange}
              style={star.value === 0 ? { display: "none" } : undefined}
            />
            <label
              title={star.title}
              htmlFor={`star${star.value}-${index}`}
              style={star.value === 0 ? { display: "none" } : undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 576 512"
              >
                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
              </svg>
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default Rating;