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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { logout } from "@/app/actions/logout";
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
      className={`w-max min-w-64 sm:static sm:z-0 flex-col pt-6 sm:pt-0 sm:flex transition-transform duration-300 ${
        isPanelOpen
          ? "fixed inset-0 bg-white backdrop-blur-sm z-40 -translate-x-full mt-16"
          : "fixed translate-x-0 bg-white backdrop-blur-sm  h-full sm:border-0 border-r border-zinc-200 z-40"
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

        {/* Déconnexion */}
        <AlertDialog>
          <AlertDialogTrigger className="w-full justify-start" asChild>
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
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Êtes-vous sûr de vouloir vous déconnecter ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Vous allez être redirigé vers la page de connexion.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => {
                  logout();
                }}
              >
                Déconnexion
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Aside;
