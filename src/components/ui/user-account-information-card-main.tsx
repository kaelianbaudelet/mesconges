import React, { useState, useEffect } from "react";
import { fetchUser } from "@/app/actions/fetchUser";
import type { User } from "@/lib/user";
import Image from "next/image";

const UserAccountInformationCardMain: React.FC = () => {
  const [user, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // État de chargement

  useEffect(() => {
    // Appeler l'action serveur pour récupérer les informations de l'utilisateur
    const fetchUserInfo = async () => {
      try {
        const userData = await fetchUser();
        setUserInfo(userData); // Mettre à jour l'état avec les données
      } catch (error) {
        console.error(
          "Erreur de récupération des informations utilisateur",
          error
        );
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchUserInfo();
  }, []);

  // Si les données sont encore en cours de chargement, afficher un loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full relative">
        <div className="spinner spinner-xl"></div>
      </div>
    );
  }

  // Préparer les informations utilisateur pour l'affichage
  const userInfo = [
    { label: "ID de compte", value: user?.id },
    {
      label: "Role",
      value: user?.role === "admin" ? "Administrateur" : "Utilisateur",
    },
    { label: "Nom", value: user?.name },
    { label: "Email", value: user?.email },
  ];

  return (
    <>
      <div className="px-5 pt-5 pb-0 bg-white rounded-xl border border-zinc-200 border-solid">
        <Image
          className="object-cover w-full h-44 rounded-xl"
          src="/user-background.jpg"
          alt="Arrière-plan de l'utilisateur"
          width={2560}
          height={1440}
          quality={100}
        />

        <div className="-mt-24">
          <div className="flex relative mx-auto w-32 h-32 rounded-full border-4 border-white border-solid">
            <Image
              className="block object-cover w-full max-w-full h-full align-middle rounded-full"
              src={user?.picture || "/default-avatar.svg"}
              width={128}
              height={128}
              quality={100}
              alt="User Avatar"
            />
          </div>

          <div className="mt-3 pb-5 text-center">
            <h1 className="m-0 text-xl font-semibold leading-7 text-black">
              {user?.name}
            </h1>
            <p className="m-0 text-zinc-500">
              {user?.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccountInformationCardMain;
