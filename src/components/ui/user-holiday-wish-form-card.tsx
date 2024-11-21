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

interface UserHolidayWishFormCardProps {
  defaultDates?: Date[];
}

const UserHolidayWishFormCard: React.FC<UserHolidayWishFormCardProps> = ({
  defaultDates,
}) => {
  const [wish1Dates, setWish1Dates] = useState<Date[]>([]);
  const [wish2Dates, setWish2Dates] = useState<Date[]>([]);
  const [wish3Dates, setWish3Dates] = useState<Date[]>([]);
  const [wish1Valid, setWish1Valid] = useState(true);
  const [wish2Valid, setWish2Valid] = useState(true);
  const [wish3Valid, setWish3Valid] = useState(true);
  const [children, setPoints] = useState("");
  const [familyStatus, setFamilyStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    wish1: "",
    wish2: "",
    wish3: "",
    children: "",
    familyStatus: "",
  });

  useEffect(() => {
    if (defaultDates) {
      setWish1Dates(defaultDates);
    }
  }, [defaultDates]);

  const validateForm = () => {
    const newErrors = {
      wish1: "",
      wish2: "",
      wish3: "",
      children: "",
      familyStatus: "",
    };

    if (!wish1Valid) {
      newErrors.wish1 =
        "Veuillez sélectionner entre 10 et 20 jours, en vous assurant que 10 d'entre eux soient consécutifs.";
    }
    if (!wish2Valid) {
      newErrors.wish2 =
        "Veuillez sélectionner entre 10 et 20 jours, en vous assurant que 10 d'entre eux soient consécutifs.";
    }
    if (!wish3Valid) {
      newErrors.wish3 =
        "Veuillez sélectionner entre 10 et 20 jours, en vous assurant que 10 d'entre eux soient consécutifs.";
    }

    const pointsNum = Number(children);
    if (
      !children ||
      pointsNum < 0 ||
      pointsNum > 20 ||
      !Number.isInteger(pointsNum)
    ) {
      newErrors.children = "Le nombre d'enfants doit être entre 0 et 20";
    }

    if (!familyStatus) {
      newErrors.familyStatus =
        "Veuillez sélectionner votre situation familiale";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (validateForm()) {
      console.log("Form submitted successfully", {
        wish1Dates,
        wish2Dates,
        wish3Dates,
        children,
        familyStatus,
      });
    }
  };

  const handleWish1DateChange = (dates: Date[], valid: boolean) => {
    setWish1Dates(dates);
    setWish1Valid(valid);
    setErrors((prevErrors) => {
      if (valid && prevErrors.wish1) {
        return { ...prevErrors, wish1: "" };
      }
      return prevErrors;
    });
  };

  const handleWish2DateChange = (dates: Date[], valid: boolean) => {
    setWish2Dates(dates);
    setWish2Valid(valid);
    setErrors((prevErrors) => {
      if (valid && prevErrors.wish2) {
        return { ...prevErrors, wish2: "" };
      }
      return prevErrors;
    });
  };

  const handleWish3DateChange = (dates: Date[], valid: boolean) => {
    setWish3Dates(dates);
    setWish3Valid(valid);
    setErrors((prevErrors) => {
      if (valid && prevErrors.wish3) {
        return { ...prevErrors, wish3: "" };
      }
      return prevErrors;
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPoints(value);
    const pointsNum = Number(value);
    if (pointsNum >= 0 && pointsNum <= 20 && Number.isInteger(pointsNum)) {
      setErrors((prevErrors) => {
        if (prevErrors.children) {
          return { ...prevErrors, children: "" };
        }
        return prevErrors;
      });
    }
  };

  const handleFamilyStatusChange = (value: string) => {
    setFamilyStatus(value);
    if (value) {
      setErrors((prevErrors) => {
        if (prevErrors.familyStatus) {
          return { ...prevErrors, familyStatus: "" };
        }
        return prevErrors;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Bloque les lettres et autres caractères non numériques
    const invalidKeys = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    if (invalidKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

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
          <DayPicker dates={wish1Dates} onDateChange={handleWish1DateChange} />
          {submitted && errors.wish1 && (
            <p className="text-sm text-red-500">{errors.wish1}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Deuxième vœu</label>
          <DayPicker dates={wish2Dates} onDateChange={handleWish2DateChange} />
          {submitted && errors.wish2 && (
            <p className="text-sm text-red-500">{errors.wish2}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Troisième vœu</label>
          <DayPicker dates={wish3Dates} onDateChange={handleWish3DateChange} />
          {submitted && errors.wish3 && (
            <p className="text-sm text-red-500">{errors.wish3}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Enfants</label>
          <Input
            type="number"
            value={children}
            onChange={handlePointsChange}
            onKeyDown={handleKeyDown} // Ajout du gestionnaire de touche
            className="w-full"
          />
          {submitted && errors.children && (
            <p className="text-sm text-red-500">{errors.children}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Situation familiale
          </label>
          <Select onValueChange={handleFamilyStatusChange} value={familyStatus}>
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

        <Button type="submit" className="w-full">
          Soumettre
        </Button>
      </form>
    </div>
  );
};

export default UserHolidayWishFormCard;
