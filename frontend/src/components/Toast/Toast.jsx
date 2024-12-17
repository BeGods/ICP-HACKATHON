import { toast } from "react-toastify";
import ToastMesg from "./ToastMesg";

import { t } from "i18next";

export const showToast = (type) => {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(300);
  }
  switch (type) {
    case "convert_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Convert.success.title")}
          desc={t("toasts.Convert.success.desc")}
          status={"success"}
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
          status={"fail"}
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
    case "quest_share_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Quest_share.success.title")}
          desc={t("toasts.Quest_share.success.desc")}
          status={"success"}
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
    case "quest_share_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Quest_share.success.error")}
          desc={t("toasts.Quest_share.success.error")}
          status={"fail"}
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
    case "orb_claim_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Quest_orb_claim.success.title")}
          desc={t("toasts.Quest_orb_claim.success.desc")}
          status={"success"}
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
    case "orb_claim_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Quest_orb_claim.error.title")}
          desc={t("toasts.Quest_orb_claim.error.desc")}
          status={"fail"}
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
    case "quest_complete_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Quest_complete.error.title")}
          desc={t("toasts.Quest_complete.error.desc")}
          status={"fail"}
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
    case "quest_claim_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Quest_claim.success.title")}
          desc={t("toasts.Quest_claim.success.desc")}
          status={"success"}
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
    case "quest_claim_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Quest_claim_InsufficientOrbs.error.title")}
          desc={t("toasts.Quest_claim_InsufficientOrbs.error.desc")}
          status={"fail"}
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
    case "booster_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Booster_Claim.success.title")}
          desc={t("toasts.Booster_Claim.success.desc")}
          status={"success"}
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
    case "booster_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Booster_Claim.error.title")}
          desc={t("toasts.Booster_Claim.error.desc")}
          status={"fail"}
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
    case "copy_link":
      toast.success(
        <ToastMesg
          title={t("toasts.ReferralCopy.success.title")}
          desc={t("toasts.ReferralCopy.success.desc")}
          status={"other"}
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
    case "ton_connect_success":
      toast.success(
        <ToastMesg
          title={t("toasts.TonConnect.success.title")}
          desc={t("toasts.TonConnect.success.desc")}
          img={"success"}
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
    case "convert_key_success":
      toast.error(
        <ToastMesg
          title={t("toasts.Conversion_Multiplier.success.title")}
          desc={t("toasts.Conversion_Multiplier.success.desc")}
          status={"success"}
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
    case "convert_key_fail":
      toast.error(
        <ToastMesg
          title={t("toasts.Conversion_Multiplier.error.title")}
          desc={t("toasts.Conversion_Multiplier.error.desc")}
          status={"fail"}
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
    case "task_success":
      toast.error(
        <ToastMesg
          title={t("toasts.Tasks.success.title")}
          desc={t("toasts.Tasks.success.desc")}
          status={"success"}
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
    case "task_fail":
      toast.error(
        <ToastMesg
          title={t("toasts.Tasks.error.title")}
          desc={t("toasts.Tasks.error.desc")}
          status={"fail"}
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
    case "ton_connect_error":
      toast.error(
        <ToastMesg
          title={t("toasts.TonConnect.error.title")}
          desc={t("toasts.TonConnect.error.desc")}
          status={"fail"}
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
    case "form_success":
      toast.success(
        <ToastMesg
          title={t("toasts.InputValidate.success.title")}
          desc={t("toasts.InputValidate.success.desc")}
          status={"success"}
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
    case "form_error":
      toast.error(
        <ToastMesg
          title={t("toasts.InputValidate.error.title")}
          desc={t("toasts.InputValidate.error.desc")}
          status={"fail"}
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
    case "onboard_success":
      toast.error(
        <ToastMesg
          title={t("toasts.OnboardSuccess.success.title")}
          desc={t("toasts.OnboardSuccess.success.desc")}
          status={"success"}
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
    case "onboard_error":
      toast.error(
        <ToastMesg
          title={t("toasts.OnboardSuccess.error.title")}
          desc={t("toasts.OnboardSuccess.error.desc")}
          status={"fail"}
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
    case "voucher_success":
      toast.error(
        <ToastMesg
          title={t("toasts.Voucher.success.title")}
          desc={t("toasts.Voucher.success.desc")}
          status={"success"}
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
    case "voucher_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Voucher.error.title")}
          desc={t("toasts.Voucher.error.desc")}
          status={"fail"}
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
    case "ad_error":
      toast.error(
        <ToastMesg
          title={"Something went wrong."}
          desc={"There was an issue loading the ad. Please try again."}
          status={"fail"}
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
          title={t("toasts.default.error.title")}
          desc={t("toasts.default.error.desc")}
          status={"fail"}
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
