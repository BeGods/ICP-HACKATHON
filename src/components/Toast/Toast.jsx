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
    case "lost_quest_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Booster_Lost_Not_Available.error.title")}
          desc={t("toasts.Booster_Lost_Not_Available.error.desc")}
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
    case "lost_quest_error":
      toast.error(
        <ToastMesg
          title={"There was a problem in loading quests."}
          desc={"Please try again later"}
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
    case "claim_minion_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Booster_ShardsClaim.success.title")}
          desc={t("toasts.Booster_ShardsClaim.success.desc")}
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
    case "claim_minion_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Booster_InsufficientOrbs.error.title")}
          desc={t("toasts.Booster_InsufficientOrbs.error.desc")}
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
    case "claim_automata_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Booster_AutomataClaim.success.title")}
          desc={t("toasts.Booster_AutomataClaim.success.desc")}
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
    case "claim_automata_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Booster_InsufficientOrbs.error.title")}
          desc={t("toasts.Booster_InsufficientOrbs.error.desc")}
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

    default:
      toast.info(
        <ToastMesg
          title={"Info"}
          desc={"This is an informational message."}
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
  }
};
