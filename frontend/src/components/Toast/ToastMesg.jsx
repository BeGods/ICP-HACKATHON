const ToastMesg = ({ title, desc, img }) => {
  return (
    <div className=" rounded-[10px] mx-[15px] select-none  bg-white">
      <div className="flex gap-x-[15px]">
        <div className="flex justify-center items-center">
          <img src={img} className="w-[24px] h-auto" alt="logo" />
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
