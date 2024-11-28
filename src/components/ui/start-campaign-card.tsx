"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCampaign } from "@/app/actions/createCampaign";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StartCampaignCardProps {
  onCampaignCreated: () => void;
}

const StartCampaignCard: React.FC<StartCampaignCardProps> = ({
  onCampaignCreated,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [startWishSelection, setStartWishSelection] = useState<string>("");
  const [endWishSelection, setEndWishSelection] = useState<string>("");
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

  const handleStartWishSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartWishSelection(event.target.value);
  };

  const handleEndWishSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEndWishSelection(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage("");

    if (!startDate || !endDate || !startWishSelection || !endWishSelection) {
      setErrorMessage("Toutes les dates doivent être remplies.");
    } else if (new Date(startDate) > new Date(endDate)) {
      setErrorMessage(
        "La date de début de campagne ne peut pas être supérieure à la date de fin."
      );
    } else if (new Date(startWishSelection) > new Date(endWishSelection)) {
      setErrorMessage(
        "La date de début des souhaits ne peut pas être supérieure à la date de fin."
      );
    } else if (new Date(endDate) > new Date(startWishSelection)) {
      setErrorMessage(
        "La fin de la campagne ne peut pas dépasser le début de la période de souhaits."
      );
    } else {
      try {
        await createCampaign(
          startDate,
          endDate,
          startWishSelection,
          endWishSelection
        );
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
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-start">
                    Réglage de la période de campagne
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-y-4 text-start">
                    <p className="text-zinc-500 text-xs font-medium">
                      Veuillez définir une période de début et de fin pour la
                      campagne. Les utilisateurs pourront soumettre leurs voeux
                      de congés pendant cette période. A la fin de la période,
                      les utilisateurs ne pourront plus soumettre de voeux.
                    </p>
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-semibold text-black"
                      >
                        Date de début
                      </label>
                      <Input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="mt-1 block w-full rounded-md sm:text-sm"
                        value={startDate}
                        onChange={handleStartDateChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-semibold text-black"
                      >
                        Date de fin
                      </label>
                      <Input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="mt-1 block w-full rounded-md sm:text-sm"
                        value={endDate}
                        onChange={handleEndDateChange}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-start">
                    Réglage de la plage de dates pour les demandes de congés
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-y-4 text-start">
                    <p className="text-zinc-500 text-xs font-medium">
                      Veuillez définir une plage de dates pour la sélection des
                      demandes de congés. Les utilisateurs devront choisir des
                      dates comprises dans cette plage.
                    </p>
                    <div>
                      <label
                        htmlFor="startLeaveRequestRange"
                        className="block text-sm font-semibold text-black"
                      >
                        Date de début
                      </label>
                      <Input
                        type="date"
                        id="startLeaveRequestRange"
                        className="mt-1 block w-full rounded-md sm:text-sm"
                        value={startWishSelection}
                        onChange={handleStartWishSelectionChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endLeaveRequestRange"
                        className="block text-sm font-semibold text-black"
                      >
                        Date de fin
                      </label>
                      <Input
                        type="date"
                        id="endLeaveRequestRange"
                        className="mt-1 block w-full rounded-md sm:text-sm"
                        value={endWishSelection}
                        onChange={handleEndWishSelectionChange}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AlertDialogHeader>
            {errorMessage && (
              <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
            )}
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
