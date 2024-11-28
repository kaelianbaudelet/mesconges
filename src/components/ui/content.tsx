"use client";

import * as React from "react";
import Aside from "@/components/ui/aside";
import Campaign from "@/components/ui/campaign";
import UserAccountInformationCard from "@/components/ui/user-account-information-card";
import UserAccountInformationCardMain from "@/components/ui/user-account-information-card-main";
import { UserListCard } from "@/components/ui/user-list-card";
import MyWishes from "./mywishes";

const Content: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("campagne");
  const [isPanelOpen, setIsPanelOpen] = React.useState<boolean>(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <>
      <main className="max-w-[1110px] mx-auto w-full flex ">
        <div className="flex text-black lg:px-8 sm:px-6 w-full pt-16 sm:pt-[5.5rem] ">
          <Aside
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isPanelOpen={isPanelOpen}
          />
          <div className="w-full flex flex-col overflow-hidden sm:px-0 px-5 gap-6 pb-10 sm:pt-0 pt-5">
            <div className="flex flex-wrap gap-x-5 justify-between items-center leading-6 text-black sm:hidden">
              <h1 className="text-xl font-semibold leading-7">
                {activeTab === "campagne" && "Campagne"}
                {activeTab === "utilisateurs" && "Utilisateurs"}
                {activeTab === "voeux_conges" && "Voeux de congés"}
                {activeTab === "mon_compte" && "Mon compte"}
              </h1>
              <button
                type="button"
                className="inline-flex gap-x-2 justify-center items-center p-0 m-0 w-8 h-8 text-sm font-medium leading-5 text-center text-black normal-case bg-white bg-none rounded-lg border border-gray-200 border-solid cursor-pointer focus:outline-offset-2"
                aria-label="Ouvrir le panneau"
                onClick={togglePanel}
              >
                <span className="text-center border-zinc-100 border-solid sr-only">
                  Ouvrir le panneau
                </span>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6H20M4 12H14M4 18H9"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {activeTab === "campagne" && <Campaign />}

            {activeTab === "utilisateurs" && <UserListCard />}

            {activeTab === "voeux_conges" && (
              <>
                <UserAccountInformationCardMain />
                <MyWishes />
              </>
            )}

            {activeTab === "mon_compte" && <UserAccountInformationCard />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Content;
