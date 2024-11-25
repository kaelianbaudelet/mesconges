import React, { useEffect, useState } from "react";
import StartCampaignCard from "./start-campaign-card";
import CampaignStatsCard from "./campaign-stats-card";
import UserHolidayWishlistCard from "./user-holiday-wishlist-card";
import { checkCampaignStatus } from "@/app/actions/checkCampaignStatus";

const Campaign: React.FC = () => {
  const [campaignExists, setCampaignExists] = useState<boolean | null>(null);

  // Fonction pour mettre à jour l'état de la campagne existante
  const onCampaignCreated = () => {
    setCampaignExists(true);
  };

  // Fonction pour mettre à jour l'état quand la campagne est supprimée
  const onCampaignDeleted = () => {
    setCampaignExists(false);
  };

  useEffect(() => {
    const fetchCampaignStatus = async () => {
      try {
        const exists = await checkCampaignStatus();
        setCampaignExists(exists);
      } catch (error) {
        console.error("Erreur lors de la vérification de la campagne:", error);
      }
    };

    fetchCampaignStatus();
  }, []);

  if (campaignExists === null) {
    return (
      <div className="flex justify-center items-center h-full relative">
        <div className="spinner spinner-xl"></div>
      </div>
    );
  }

  return (
    <>
      {campaignExists ? (
        <>
          <CampaignStatsCard onCampaignDeleted={onCampaignDeleted} />
          <UserHolidayWishlistCard />
        </>
      ) : (
        <StartCampaignCard onCampaignCreated={onCampaignCreated} />
      )}
    </>
  );
};

export default Campaign;
