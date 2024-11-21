"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Note,
  Account,
  Disconnect,
  Users,
} from "@/components/ui/icons";

interface AsideProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Aside: React.FC<AsideProps> = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-max min-w-64 hidden fixed inset-x-0 h-full bg-white duration-300 ease-in-out sm:static sm:z-0 sm:flex flex-col sm:pt-0 pt-6 sm:border-0 border-r z-40">
      <div className="sm:px-0 sm:pr-5 px-5">
        <ul className="flex flex-col p-0 m-0 gap-y-2">
          <li>
            <Button
              variant={activeTab === "campagne" ? "default" : "secondary"}
              className="w-full justify-start"
              onClick={() => handleTabClick("campagne")}
            >
              <Bookmark
                color={activeTab === "campagne" ? "white" : "black"}
                size={20}
              />
              Campagne
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "utilisateurs" ? "default" : "secondary"}
              className="w-full justify-start"
              onClick={() => handleTabClick("utilisateurs")}
            >
              <Users
                color={activeTab === "utilisateurs" ? "white" : "black"}
                size={20}
              />
              Utilisateurs
            </Button>
          </li>
        </ul>
        <div className="my-5 mx-2 h-px bg-zinc-200"></div>
        <ul className="flex flex-col p-0 m-0 gap-y-2">
          <li>
            <Button
              variant={activeTab === "voeux_conges" ? "default" : "secondary"}
              className="w-full justify-start"
              onClick={() => handleTabClick("voeux_conges")}
            >
              <Note
                color={activeTab === "voeux_conges" ? "white" : "black"}
                size={20}
              />
              Mes voeux
            </Button>
          </li>

          <li>
            <Button
              variant={activeTab === "mon_compte" ? "default" : "secondary"}
              className="w-full justify-start"
              onClick={() => handleTabClick("mon_compte")}
            >
              <Account
                color={activeTab === "mon_compte" ? "white" : "black"}
                size={20}
              />
              Mon compte
            </Button>
          </li>
        </ul>

        <div className="my-5 mx-2 h-px bg-zinc-200"></div>

        <Button
          variant="secondary"
          className="bg-none hover:bg-destructive w-full justify-start hover:text-white group"
        >
          <Disconnect
            color="white"
            size={20}
            className="fill-black group-hover:fill-white transition-colors"
          />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default Aside;
