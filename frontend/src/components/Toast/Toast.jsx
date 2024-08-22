import { toast } from "react-toastify";
import ToastMesg from "./ToastMesg";
import successImg from "../../../public/assets/icons/toast.success.svg";
import failImg from "../../../public/assets/icons/toast.fail.svg";

import { t } from "i18next";

export const showToast = (type) => {
  console.log("type:", type);
  switch (type) {
    case "convert_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Convert.success.title")}
          desc={t("toasts.Convert.success.desc")}
          img={successImg}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      break;
    case "convert_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Convert.error.title")}
          desc={t("toasts.Convert.error.desc")}
          img={failImg}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      break;
    default:
      toast.info(
        <ToastMesg
          title={"Info"}
          desc={"This is an informational message."}
          img={"/assets/icons/toast.info.svg"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      break;
  }
};
