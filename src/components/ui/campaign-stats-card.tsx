"use client";

import React, { useEffect, useState } from "react";
import { getCampaignStats } from "@/app/actions/getCampaignStats";
import { Button } from "./button";
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
import { deleteCampaign } from "@/app/actions/deleteCampaign"; // Import de la Server Action
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

// Fonction pour générer une chaîne aléatoire
const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

interface CampaignStatsCardProps {
  onCampaignDeleted: () => void; // Fonction de callback pour signaler la suppression
}

const CampaignStatsCard: React.FC<CampaignStatsCardProps> = ({
  onCampaignDeleted,
}) => {
  const [stats, setStats] = useState<{
    totalUsers: number;
    usersWithWishes: number;
    usersWithoutWishes: number;
    campaignPeriod: { startDate: string; endDate: string } | null;
  } | null>(null);

  const [isDeleting, setIsDeleting] = useState(false); // Etat pour suivre le statut de la suppression
  const [isModalOpen, setIsModalOpen] = useState(false); // Etat pour gérer l'ouverture de la modal
  const [confirmationInput, setConfirmationInput] = useState(""); // Valeur de l'input de confirmation
  const [isInputValid, setIsInputValid] = useState(false); // Statut pour savoir si l'input est correct

  const [randomString, setRandomString] = useState(""); // Stocke la chaîne aléatoire à afficher

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCampaignStats();
        setStats({
          ...data,
          campaignPeriod: data.campaignPeriod
            ? {
                startDate: data.campaignPeriod.startDate.toISOString(),
                endDate: data.campaignPeriod.endDate.toISOString(),
              }
            : null,
        });
      } catch {
        toast.error("Erreur lors de la récupération des statistiques");
      }
    };

    fetchStats();

    // Générer une nouvelle chaîne aléatoire lorsque la modal est ouverte
    const newRandomString = generateRandomString(8); // Chaîne de 8 caractères aléatoires
    setRandomString(newRandomString);
  }, []);

  // Fonction pour gérer la validation de l'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmationInput(value);
    setIsInputValid(value === randomString); // Vérifie si l'input est correct
  };

  const handleDeleteCampaign = async () => {
    if (!isInputValid) {
      toast.error(
        "Vous devez taper la chaîne de confirmation pour supprimer la campagne."
      );
      return;
    }

    setIsDeleting(true); // On met à jour l'état pour afficher qu'on est en train de supprimer

    try {
      await deleteCampaign(); // Appel à la Server Action pour supprimer la campagne
      toast.success("Campagne supprimée avec succès");
      setIsModalOpen(false); // Fermer la modal après la suppression
      // Mise à jour des stats après la suppression
      setStats(null); // Efface les stats de la campagne supprimée
      onCampaignDeleted(); // Signaler la suppression au parent
    } catch {
      toast.error("Erreur lors de la suppression de la campagne");
    } finally {
      setIsDeleting(false); // Réinitialisation de l'état
    }
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-full relative">
        <div className="spinner spinner-xl"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 leading-6 text-black bg-white rounded-xl border border-gray-200 border-solid">
      <div className="flex justify-between items-center text-black">
        <h2 className="inline-block m-0 font-semibold text-black">
          Information de la campagne
        </h2>
        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
              Supprimer la campagne
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la campagne ?</AlertDialogTitle>
              <AlertDialogDescription>
                En supprimant la campagne, vous supprimerez également toutes les
                données associées. Les voeux de congés soumis par les
                utilisateurs seront également supprimés. Cette action est
                irréversible.
              </AlertDialogDescription>
              {/* Affichage de la chaîne aléatoire générée */}
              <div className="mt-4">
                <label className="block text-sm text-gray-600">
                  Pour supprimer et confirmer la suppression, tapez :
                  <strong> {randomString}</strong>
                </label>
                <Input
                  type="text"
                  value={confirmationInput}
                  onChange={handleInputChange}
                  className={`mt-2 py-3.5 px-2 border-2 rounded-full ${
                    isInputValid ? "border-green-500" : "border-red-500"
                  }`}
                  placeholder={`Tapez "${randomString}" pour confirmer`}
                />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsModalOpen(false)}>
                Annuler
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDeleteCampaign}
                disabled={isDeleting || !isInputValid} // Désactiver si l'input n'est pas valide
              >
                {isDeleting ? "Suppression en cours..." : "Supprimer"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-4 mt-3 mb-0 text-black sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col p-4 rounded-xl border border-gray-200 border-solid">
          <h2 className="m-0 text-sm leading-5 text-zinc-500">
            Utilisateurs au total
          </h2>
          <div className="flex gap-x-1.5 items-center">
            <p className="m-0 text-xl font-semibold leading-7 text-black">
              {stats.totalUsers}
            </p>
          </div>
        </div>

        <div className="flex flex-col p-4 rounded-xl border border-gray-200 border-solid">
          <h2 className="m-0 text-sm leading-5 text-zinc-500">Congés soumis</h2>
          <div className="flex gap-x-1.5 items-center">
            <p className="m-0 text-xl font-semibold leading-7 text-black">
              {stats.usersWithWishes}
            </p>
          </div>
        </div>

        <div className="flex flex-col p-4 rounded-xl border border-gray-200 border-solid">
          <h2 className="m-0 text-sm leading-5 text-zinc-500">
            Congés en attente
          </h2>
          <div className="flex gap-x-1.5 items-center">
            <p className="m-0 text-xl font-semibold leading-7 text-black">
              {stats.usersWithoutWishes}
            </p>
          </div>
        </div>
      </div>

      {stats.campaignPeriod && (
        <div className="mt-5 flex flex-col p-4 rounded-xl border border-gray-200 border-solid">
          <h2 className="m-0 text-sm leading-5 text-zinc-500">
            Période de la campagne de voeux
          </h2>
          <div className="flex gap-x-1.5 items-center">
            <p className="m-0 text-md font-semibold leading-7 text-black">
              {new Date(stats.campaignPeriod.startDate).toLocaleDateString()} au{" "}
              {new Date(stats.campaignPeriod.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignStatsCard;
