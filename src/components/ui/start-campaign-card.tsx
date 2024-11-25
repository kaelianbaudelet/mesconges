"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCampaign } from "@/app/actions/createCampaign";

interface StartCampaignCardProps {
  onCampaignCreated: () => void;
}

const StartCampaignCard: React.FC<StartCampaignCardProps> = ({
  onCampaignCreated,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage("");

    if (!startDate || !endDate) {
      setErrorMessage("Les deux dates doivent être remplies.");
    } else if (new Date(startDate) > new Date(endDate)) {
      setErrorMessage(
        "La date de début ne peut pas être supérieure à la date de fin."
      );
    } else {
      try {
        await createCampaign(startDate, endDate);
        console.log("Campagne démarrée avec succès");

        toast.success("Campagne démarrée avec succès");

        setOpen(false);

        // Appelle la fonction de rappel pour notifier la création de la campagne
        onCampaignCreated();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Erreur lors de la création de la campagne."
        );
      }
    }
  };

  return (
    <div className="min-h-96 border border-zinc-200 rounded-2xl justify-center items-center flex flex-col p-4">
      <h1 className="text-xl font-semibold leading-7 mb-4 text-center">
        Il n&apos;y a pas de campagne en cours
      </h1>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Démarrer une campagne
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={handleSubmit}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Commencer une campagne de voeux de congés
              </AlertDialogTitle>
              <AlertDialogDescription>
                Pour démarrer une campagne de voeux de congés, veuillez définir
                une période de début et de fin. Les utilisateurs pourront
                soumettre leurs voeux de congés pendant cette période. A la fin
                de la période, les utilisateurs ne pourront plus soumettre de
                voeux.
              </AlertDialogDescription>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-black"
                >
                  Date de début
                </label>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="mt-1 block w-full rounded-md border-gray-300 sm:text-sm"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-black"
                >
                  Date de fin
                </label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="mt-1 block w-full rounded-md border-gray-300 sm:text-sm"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col gap-2">
              <Button type="submit">Démarrer la campagne</Button>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StartCampaignCard;
