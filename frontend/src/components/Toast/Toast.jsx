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
      toast.success(
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
      toast.success(
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
    case "stake_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Stake.success.title")}
          desc={t("toasts.Stake.success.desc")}
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
    case "stake_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Stake.error.title")}
          desc={t("toasts.Stake.error.desc")}
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
    case "success_avatar":
      toast.success(
        <ToastMesg
          title={t("toasts.Profile.success.title")}
          desc={t("toasts.Profile.success.desc")}
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
    case "error_payment":
      toast.error(
        <ToastMesg
          title={t("Payment Unsuccessful")}
          desc={t("The payment was canceled or failed. Please try again.")}
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

    case "item_success_bag":
      toast.success(
        <ToastMesg
          title={t("toasts.RoRItem.success-bag.title")}
          desc={t("toasts.RoRItem.success-bag.desc")}
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
    case "item_success_pouch":
      toast.success(
        <ToastMesg
          title={t("toasts.RoRItem.success-pouch.title")}
          desc={t("toasts.RoRItem.success-pouch.desc")}
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
    case "item_error":
      toast.error(
        <ToastMesg
          title={t("toasts.RoRItem.error.title")}
          desc={t("toasts.RoRItem.error.desc")}
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
    case "join_success":
      toast.success(
        <ToastMesg
          title={t("toasts.JoinItem.success.title")}
          desc={t("toasts.JoinItem.success.desc")}
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
    case "join_error":
      toast.error(
        <ToastMesg
          title={t("toasts.JoinItem.error.title")}
          desc={t("toasts.JoinItem.error.desc")}
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
    case "meal_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Meal.success.title")}
          desc={t("toasts.Meal.success.desc")}
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
    case "meal_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Meal.error.title")}
          desc={t("toasts.Meal.error.desc")}
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
    case "sell_success":
      toast.success(
        <ToastMesg
          title={t("toasts.SellItem.success.title")}
          desc={t("toasts.SellItem.success.desc")}
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
    case "sell_error":
      toast.error(
        <ToastMesg
          title={t("toasts.SellItem.error.title")}
          desc={t("toasts.SellItem.error.desc")}
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
    case "vault_success":
      toast.success(
        <ToastMesg
          title={t("toasts.Vault.success.title")}
          desc={t("toasts.Vault.success.desc")}
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
    case "vault_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Vault.error.title")}
          desc={t("toasts.Vault.error.desc")}
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
    case "pouch_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Vault.pouch_error.title")}
          desc={t("toasts.Vault.pouch_error.desc")}
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
    case "wallet_unlinked":
      toast.error(
        <ToastMesg
          title={t("toasts.TonConnect.notConnected.title")}
          desc={t("toasts.TonConnect.notConnected.desc")}
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
    case "payout_success":
      toast.error(
        <ToastMesg
          title={t("toasts.Payout.success.title")}
          desc={t("toasts.Payout.success.desc")}
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
    case "payout_error":
      toast.error(
        <ToastMesg
          title={t("toasts.Payout.error.title")}
          desc={t("toasts.Payout.error.desc")}
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
