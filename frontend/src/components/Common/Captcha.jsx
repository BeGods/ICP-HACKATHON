import React, { useState } from "react";
import "../../Captcha/style.scss";
import Verify from "../../Captcha/index";

const Captcha = ({ auth }) => {
  return (
    <div className="flex items-center select-none justify-center  h-full backdrop-blur-sm z-50">
      <div className="captchaBg h-[340px] w-fit py-3 px-3">
        <Verify
          onSuccess={auth}
          imgUrl={"/assets/uxui/320px-frogdog.captcha.png"}
        />
      </div>
    </div>
  );
};

export default Captcha;
