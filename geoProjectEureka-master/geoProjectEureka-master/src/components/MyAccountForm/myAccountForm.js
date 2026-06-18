import React, { Fragment, useState } from "react";
import userInfosFormData from "../../formData/userInfosFormData";
import Input from "../Input/input";
import useModifiedUserInfos from "../../hooks/data/post/useModifiedUserInfos";
import ButtonValidationForm from "../ButtonValidationForm/buttonValidationForm";
import useDeleteUserAccount from "../../hooks/data/post/useDeleteUserAccount";
import Password from "../Password/password";
import TitleFade from "../TitleFade/titleFade";
import ButtonWithVerification from "../ButtonWithVerification/buttonWithVerification";

const MyAccountForm = ({ userInfosData }) => {
  const { handleSubmit, isLoadingModificationUserInfos, alertBanner } = useModifiedUserInfos();
  const { handleDeleteAccount, isLoadingDeleteAccount, alertBannerDeleteAccount } = useDeleteUserAccount();

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handlesetIsPasswordValid = () => {
    setIsPasswordValid(!isPasswordValid);
  };

  const inputs = userInfosFormData.map((input, index) => {
    if (input.id === "newPassword" && isEditable) {
      return (
        <Password
          key={index}
          title={input.title}
          id={input.id}
          type={input.type}
          size={input.size}
          isDisable={!isEditable}
          handlesetIsPasswordValid={handlesetIsPasswordValid}
        />
      );
    } else if (input.id === "newPassword" && !isEditable) {
      return <div key={index}></div>;
    } else {
      return (
          <Input
            key={index}
            defaultValue={userInfosData && userInfosData[input.id]}
            title={input.title}
            id={input.id}
            type={input.type}
            size={input.size}
            isDisable={input.id === "email"?true:!isEditable}
            options={input.type === "select" && input.options}
          />
      );
    }
  });

  return (
    <div>
      {alertBanner && alertBanner}
      {alertBannerDeleteAccount && alertBannerDeleteAccount}
      <TitleFade title="My Account" />
      <Fragment>
        <form action="#" method="PUT" onSubmit={(e) => handleSubmit(e)}>
          <div className={isEditable? "border-b border-gray-900/10 pb-2 pt-2":"pb-2 pt-2"}>
            {inputs}
          </div>
          {isEditable && (
            <div className="mt-6 flex items-center justify-end gap-x-6 pb-4">
              <ButtonValidationForm isLoading={isLoadingModificationUserInfos} isPasswordValid={isPasswordValid} size={"w-fit"} title={"Save"} />
            </div>
          )}
        </form>
        {userInfosData && (
          <div className={`${isEditable && "border-t border-gray-900/10"} flex flex-nowrap pt-2`}>
            <div className="pl-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditable(!isEditable);
                }}
                className={`btn rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-fit border-none`}
              >
                Edit Information
              </button>
            </div>
            <div className="pl-4 pb-2">
              <ButtonWithVerification query={handleDeleteAccount} isLoading={isLoadingDeleteAccount} text="Delete account"/>
            </div>
          </div>
        )}
      </Fragment>
    </div>
  );
};

export default MyAccountForm;
