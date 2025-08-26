const ICPLoginButton = ({ imgSrc, name, color, methodName }) => {
  return (
    <button
      onClick={methodName}
      className="flex items-center w-full mb-2 justify-center bg-black/40 backdrop-blur-md rounded-lg transition-transform duration-300 hover:scale-110 border-[2px] border-transparent hover:shadow-neon p-2 drop-shadow-lg sm:w-full md:w-full"
      style={{
        "--hover-color": color,
      }}
    >
      <img src={imgSrc} alt={name} className="h-14 w-14" />
      <h1 className="text-[18px] font-semibold ml-4">{name}</h1>
    </button>
  );
};

export default ICPLoginButton;
