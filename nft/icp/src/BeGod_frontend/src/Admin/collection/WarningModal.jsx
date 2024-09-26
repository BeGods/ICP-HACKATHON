import React from "react";
import { RxCross2 } from "react-icons/rx";
import { IoIosWarning } from "react-icons/io";

const WarningModal = (props) => {
  const { togglewarning, onUpload } = props;

  // const onClickAddButton = () => {
  //   togglewarning();
  // };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-400"
          onClick={() => togglewarning()}
        >
          <RxCross2 size={25} />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center">
          <IoIosWarning />
        </div>

        {/* Warning Message */}
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">
            Warning! Once Uploaded Can’t Be Edited
          </p>
          <p className="text-sm mt-2 text-gray-300">
            Please Check details Carefully
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            className="w-1/2 bg-gray-700 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600 transition-all"
            onClick={() => togglewarning()}
          >
            Cancel
          </button>
          <button
            className="w-1/2 bg-yellow-400 text-black py-2 px-4 rounded ml-2 hover:bg-yellow-500 transition-all"
            // onClick={onUpload}
            onClick={onUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
