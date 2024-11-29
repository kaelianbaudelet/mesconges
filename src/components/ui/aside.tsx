"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Note,
  Account,
  Disconnect,
  Users,
} from "@/components/ui/icons";
import { fetchUser } from "@/app/actions/fetchUser";

interface AsideProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPanelOpen: boolean;
}

const Aside: React.FC<AsideProps> = ({
  activeTab,
  setActiveTab,
  isPanelOpen,
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUser();
      if (user) {
        setUserRole(user.role);
        setActiveTab(user.role === "admin" ? "campagne" : "voeux_conges");
      }
    };
    fetchData();
  }, [setActiveTab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`w-max min-w-64 sm:static sm:z-0 flex-col pt-6 sm:pt-0 flex transition-transform duration-300 ${
        isPanelOpen
          ? "fixed inset-0 bg-white backdrop-blur-sm z-40 sm:translate-x-0 -translate-x-full mt-16 sm:mt-0 sm:w-max w-0"
          : "fixed bg-white backdrop-blur-sm h-full sm:border-0 border-r border-zinc-200 z-40 "
      }`}
    >
      <div className="sm:px-0 sm:pr-5 px-5">
        <ul className="flex flex-col p-0 m-0 gap-y-2">
          {userRole === "admin" && (
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
          )}

          {userRole === "admin" && (
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
          )}
        </ul>
        {userRole === "admin" && (
          <div className="my-5 mx-2 h-px bg-zinc-200"></div>
        )}
        <ul className="flex flex-col p-0 m-0 gap-y-2">
          {/* Onglet "Mes voeux" visible pour tous les utilisateurs */}
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

          {/* Onglet "Mon compte" visible pour tous les utilisateurs */}
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
          className="bg-none hover:bg-red-500 focus:bg-red-500 w-full justify-start hover:text-white group flex items-center gap-2.5 p-2.5 rounded-full transition-colors"
          variant="ghost"
          onClick={() => {
            // Ouvre une nouvelle pop-up sur l'URL de déconnexion
            const popup = window.open(
              "/logout",
              "_blank",
              "width=500,height=500"
            );

            // Vérifie régulièrement l'URL de la pop-up
            const interval = setInterval(() => {
              if (!popup || popup.closed) {
                // Si la pop-up est fermée, arrête l'intervalle
                clearInterval(interval);
              } else {
                try {
                  // Vérifie si l'URL de la pop-up contient "okta.com"
                  const currentUrl = popup.location.href;
                  if (currentUrl.includes("identite.leclerc")) {
                    popup.close(); // Ferme la pop-up
                    clearInterval(interval); // Arrête l'intervalle

                    // Action à effectuer après déconnexion
                    console.log("Déconnecté avec succès");
                    // Exemple : rediriger vers la page d'accueil
                    window.location.href = "/";
                  }
                } catch (error) {
                  // Ignore les erreurs causées par les restrictions de domaine (CORS)
                  console.error(error);
                }
              }
            }, 1000); // Vérifie toutes les 1 seconde
          }}
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
