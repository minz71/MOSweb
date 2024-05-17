"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Rating from "./components/rating";
import Button from "./components/button";
interface DescribeProps {}

const ratings = [
  { rate: 1, description: "非常不好", isFixed: true },
  { rate: 2, description: "不好", isFixed: true },
  { rate: 3, description: "普通", isFixed: true },
  { rate: 4, description: "好", isFixed: true },
  { rate: 5, description: "非常好", isFixed: true },
];

const Describe: React.FC<DescribeProps> = () => {
  const router = useRouter();

  return (
    <div className="sm:w-full md:w-full lg:w-9/12 xl:w-8/12">
      <div className="h-full bg-gradient-to-l from-slate-300 to-slate-100 text-slate-600 border border-slate-300 grid grid-col-2 justify-center p-4 gap-4 rounded-lg shadow-md">
        <div className="flex justify-center text-3xl font-bold capitalize rounded-md">
          MOS 實驗
        </div>
        <div className="col-span-1 rounded-md text-xl grid gap-2">
          <p className="flex justify-center"> 合成語音品質評估 </p>
          <p className="flex justify-center"> 感謝您參與本次實驗！ </p>
          <p className="flex justify-center">
            在這個實驗中，我們使用電腦合成人類語音。
          </p>
          <p className="flex justify-center">
            以下的音檔中，包含了真實的錄音以及合成的聲音，並且每句話都有附上文字稿。
          </p>
          <p className="flex justify-center">
            請受試者使用耳機聆聽，並根據每個音檔的品質，給予以下幾種評分：
          </p>
        </div>
        <div className="grid gap-4">
          {ratings.map((rating, index) => (
            <div
              key={index}
              className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
            >
              <div className="">
                <p className="flex justify-center">{rating.description}</p>
              </div>
              <div className="flex justify-center">
                <Rating
                  rate={rating.rate}
                  isFixed={rating.isFixed}
                  name={`rating-${index}`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-1">
          <div className="flex justify-center">
            <Button text="開始" onClick={() => router.push("/survey")}></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Describe;
