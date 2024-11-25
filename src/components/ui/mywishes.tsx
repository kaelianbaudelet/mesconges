import React, { useEffect, useState } from "react";
import { checkCampaign } from "@/app/actions/checkCampaign";
import UserHolidayWishFormCard from "@/components/ui/user-holiday-wish-form-card";
import { UserHolidayBlankWishFormCard } from "./user-holiday-blank-wish-form-card";

const MyWishes: React.FC = () => {
  const [isCampaignActive, setIsCampaignActive] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const checkCampaignStatus = async () => {
      const status = await checkCampaign();
      setIsCampaignActive(status);
    };
    checkCampaignStatus();
  }, []);

  if (isCampaignActive === null) {
    return (
      <div className="flex justify-center items-center h-full relative">
        <div className="spinner spinner-xl"></div>
      </div>
    );
  }

  return (
    <>
      {isCampaignActive ? (
        <UserHolidayWishFormCard />
      ) : (
        <UserHolidayBlankWishFormCard />
      )}
    </>
  );
};

export default MyWishes;
