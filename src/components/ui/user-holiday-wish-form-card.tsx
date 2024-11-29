"use client";
import React, { useState, useEffect } from "react";
import DayPicker from "./datepicker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { saveHolidayWishes } from "@/app/actions/saveHolidayWishes";
import { fetchCurrentHolidayWishes } from "@/app/actions/fetchCurrentHolidayWishes";
import { toast } from "react-hot-toast";
import { useCallback } from "react";
import { getCampaignStats } from "@/app/actions/getCampaignStats";

interface UserHolidayWishFormCardProps {
  defaultDates?: Date[];
}

const UserHolidayWishFormCard: React.FC<UserHolidayWishFormCardProps> = () => {
  // États de chargement et de soumission
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // États pour les dates et leur validité
  const [wish1Dates, setWish1Dates] = useState<Date[]>([]);
  const [wish2Dates, setWish2Dates] = useState<Date[]>([]);
  const [wish3Dates, setWish3Dates] = useState<Date[]>([]);
  const [wish1Valid, setWish1Valid] = useState(false);
  const [wish2Valid, setWish2Valid] = useState(false);
  const [wish3Valid, setWish3Valid] = useState(false);

  // États pour les informations personnelles
  const [children, setChildren] = useState("");
  const [familyStatus, setFamilyStatus] = useState("");

  // État pour les erreurs
  const [errors, setErrors] = useState({
    wish1: "",
    wish2: "",
    wish3: "",
    children: "",
    familyStatus: "",
  });

  const [stats, setStats] = useState<{
    campaignPeriod: {
      startWishSelection: Date;
      endWishSelection: Date;
    };
  } | null>(null);

  // Fonction pour convertir les dates string en objets Date
  const convertDatesToDateObjects = (dates: string[] | Date[]): Date[] => {
    return dates
      .map((date) => (date instanceof Date ? date : new Date(date)))
      .filter((date) => !isNaN(date.getTime()));
  };

  // Chargement des données existantes
  useEffect(() => {
    const loadExistingWishes = async () => {
      try {
        const campaignStats = await getCampaignStats();
        setStats({
          campaignPeriod: {
            startWishSelection: new Date(
              campaignStats?.campaignPeriod?.startWishSelection ?? ""
            ),
            endWishSelection: new Date(
              campaignStats?.campaignPeriod?.endWishSelection ?? ""
            ),
          },
        });

        const currentWishes = await fetchCurrentHolidayWishes();
        if (currentWishes) {
          const wish1 = convertDatesToDateObjects(currentWishes.wish1Dates);
          const wish2 = convertDatesToDateObjects(currentWishes.wish2Dates);
          const wish3 = convertDatesToDateObjects(currentWishes.wish3Dates);

          setWish1Dates(wish1);
          setWish2Dates(wish2);
          setWish3Dates(wish3);

          setWish1Valid(wish1.length >= 10);
          setWish2Valid(wish2.length >= 10);
          setWish3Valid(wish3.length >= 10);

          setChildren(currentWishes.childrenCount.toString());
          setFamilyStatus(
            currentWishes.familyStatus === "isolated" ? "isole" : "famille"
          );
        }
      } catch {
        toast.error("Impossible de charger vos vœux existants");
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingWishes();
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      wish1: "",
      wish2: "",
      wish3: "",
      children: "",
      familyStatus: "",
    };

    // Validation des dates uniquement si nécessaire
    if (!wish1Valid || wish1Dates.length < 10 || wish1Dates.length > 20) {
      newErrors.wish1 =
        "Veuillez sélectionner entre 10 et 20 jours, en vous assurant que 10 d'entre eux soient consécutifs.";
    }

    if (!wish2Valid || wish2Dates.length < 10 || wish2Dates.length > 20) {
      newErrors.wish2 =
        "Veuillez sélectionner entre 10 et 20 jours, en vous assurant que 10 d'entre eux soient consécutifs.";
    }

    if (!wish3Valid || wish3Dates.length < 10 || wish3Dates.length > 20) {
      newErrors.wish3 =
        "Veuillez sélectionner entre 10 et 20 jours, en vous assurant que 10 d'entre eux soient consécutifs.";
    }

    const childrenNum = Number(children);
    if (
      !children ||
      childrenNum < 0 ||
      childrenNum > 20 ||
      !Number.isInteger(childrenNum)
    ) {
      newErrors.children = "Le nombre d'enfants doit être entre 0 et 20";
    }

    if (!familyStatus) {
      newErrors.familyStatus =
        "Veuillez sélectionner votre situation familiale";
    }

    return newErrors;
  }, [
    wish1Valid,
    wish2Valid,
    wish3Valid,
    wish1Dates.length,
    wish2Dates.length,
    wish3Dates.length,
    children,
    familyStatus,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving) return;

    setSubmitted(true);
    const currentErrors = validateForm();
    setErrors(currentErrors);

    if (Object.values(currentErrors).every((error) => !error)) {
      setIsSaving(true);
      try {
        const result = await saveHolidayWishes({
          wish1Dates,
          wish2Dates,
          wish3Dates,
          childrenCount: parseInt(children),
          familyStatus: familyStatus === "isole" ? "isolated" : "family",
        });

        if (result.success) {
          toast.success("Vos vœux ont été enregistrés avec succès");
          setSubmitted(false);
        } else {
          throw new Error(result.error);
        }
      } catch {
        toast.error(
          "Une erreur est survenue lors de l'enregistrement de vos vœux"
        );
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Gestionnaires d'événements pour les changements de dates
  const handleWish1DateChange = useCallback(
    (dates: Date[], valid: boolean) => {
      setWish1Dates(dates);
      setWish1Valid(valid);
      if (submitted) {
        const currentErrors = validateForm();
        setErrors((prev) => ({
          ...prev,
          wish1:
            valid && dates.length >= 10 && dates.length <= 20
              ? ""
              : currentErrors.wish1,
        }));
      }
    },
    [submitted, validateForm]
  );

  const handleWish2DateChange = useCallback(
    (dates: Date[], valid: boolean) => {
      setWish2Dates(dates);
      setWish2Valid(valid);
      if (submitted) {
        const currentErrors = validateForm();
        setErrors((prev) => ({
          ...prev,
          wish2:
            valid && dates.length >= 10 && dates.length <= 20
              ? ""
              : currentErrors.wish2,
        }));
      }
    },
    [submitted, validateForm]
  );

  const handleWish3DateChange = useCallback(
    (dates: Date[], valid: boolean) => {
      setWish3Dates(dates);
      setWish3Valid(valid);
      if (submitted) {
        const currentErrors = validateForm();
        setErrors((prev) => ({
          ...prev,
          wish3:
            valid && dates.length >= 10 && dates.length <= 20
              ? ""
              : currentErrors.wish3,
        }));
      }
    },
    [submitted, validateForm]
  );
  // Gestionnaires d'événements pour les champs du formulaire
  const handleChildrenChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setChildren(value);
      if (submitted) {
        const childrenNum = Number(value);
        setErrors((prev) => ({
          ...prev,
          children:
            childrenNum >= 0 &&
            childrenNum <= 20 &&
            Number.isInteger(childrenNum)
              ? ""
              : "Le nombre d'enfants doit être entre 0 et 20",
        }));
      }
    },
    [submitted]
  );

  const handleFamilyStatusChange = useCallback(
    (value: string) => {
      setFamilyStatus(value);
      if (submitted) {
        setErrors((prev) => ({
          ...prev,
          familyStatus: value
            ? ""
            : "Veuillez sélectionner votre situation familiale",
        }));
      }
    },
    [submitted]
  );

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-5">
        <p>Chargement de vos vœux...</p>
      </div>
    );
  }

  // Rendu du formulaire
  return (
    <div className="flex flex-col p-5 leading-6 text-black bg-white rounded-xl border border-gray-200 border-solid">
      <div className="flex justify-between items-center text-black">
        <h2 className="inline-block m-0 font-semibold text-black">
          Définir vos vœux de congés
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Premier vœu</label>
          <DayPicker
            dates={wish1Dates}
            onDateChange={handleWish1DateChange}
            minDate={stats?.campaignPeriod.startWishSelection}
            maxDate={stats?.campaignPeriod.endWishSelection}
          />
          {submitted && errors.wish1 && !wish1Valid && (
            <p className="text-sm text-red-500">{errors.wish1}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Deuxième vœu</label>
          <DayPicker
            dates={wish2Dates}
            onDateChange={handleWish2DateChange}
            minDate={stats?.campaignPeriod.startWishSelection}
            maxDate={stats?.campaignPeriod.endWishSelection}
          />
          {submitted && errors.wish2 && !wish2Valid && (
            <p className="text-sm text-red-500">{errors.wish2}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Troisième vœu</label>
          <DayPicker
            dates={wish3Dates}
            onDateChange={handleWish3DateChange}
            minDate={stats?.campaignPeriod.startWishSelection}
            maxDate={stats?.campaignPeriod.endWishSelection}
          />
          {submitted && errors.wish3 && !wish3Valid && (
            <p className="text-sm text-red-500">{errors.wish3}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Enfants</label>
          <Input
            type="number"
            value={children}
            onChange={handleChildrenChange}
            className="w-full"
            disabled={isSaving}
          />
          {submitted && errors.children && (
            <p className="text-sm text-red-500">{errors.children}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Situation familiale
          </label>
          <Select
            onValueChange={handleFamilyStatusChange}
            value={familyStatus}
            disabled={isSaving}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez votre situation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="isole">Isolé</SelectItem>
              <SelectItem value="famille">Famille</SelectItem>
            </SelectContent>
          </Select>
          {submitted && errors.familyStatus && (
            <p className="text-sm text-red-500">{errors.familyStatus}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Sauvegarder"}
        </Button>
      </form>
    </div>
  );
};

export default UserHolidayWishFormCard;
