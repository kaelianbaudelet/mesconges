"use client";
import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./button";

interface DayPickerProps {
  dates: Date[];
  onDateChange: (dates: Date[], validity: boolean) => void;
  initialDates?: Date[];
}

const DayPicker: React.FC<DayPickerProps> = ({
  onDateChange,
  initialDates = [], // Valeur par défaut : tableau vide
}) => {
  const [isValid, setIsValid] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>(initialDates);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(selectedDates, isValid);
    }
  }, [selectedDates, isValid, onDateChange]);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            {selectedDates.length > 0
              ? `${selectedDates.length} jours sélectionnés`
              : "Sélectionner des jours"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
          <Calendar
            selected={selectedDates}
            onSelect={setSelectedDates}
            onValidityChange={setIsValid}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default DayPicker;
