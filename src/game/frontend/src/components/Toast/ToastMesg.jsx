import { Check, Link, X } from "lucide-react";

const ToastMesg = ({ title, desc, status }) => {
  return (
    <div className=" rounded-[10px] mx-[15px] select-none  bg-white">
      <div className="flex gap-x-[15px]">
        <div className="flex justify-center items-center">
          {status === "success" ? (
            <div className="bg-green-500 p-1 rounded-full">
              <Check color="white" />
            </div>
          ) : status === "fail" ? (
            <div className="bg-red-500 p-1 rounded-full">
              <X color="white" />
            </div>
          ) : (
            <div className="bg-orange-400 p-1 rounded-full">
              <Link color="white" />
            </div>
          )}
        </div>
        <div className="flex flex-col ">
          <p className="font-bold text-[14px]">{title}</p>
          <p className="text-[12px]">{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default ToastMesg;
