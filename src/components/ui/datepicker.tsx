"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  minDate?: Date;
  maxDate?: Date;
}

const DayPicker: React.FC<DayPickerProps> = ({
  dates = [],
  onDateChange,
  minDate,
  maxDate,
}) => {
  const [isValid, setIsValid] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>(dates);

  // Optimisé pour ne s'exécuter que lorsque les dates externes changent
  useEffect(() => {
    if (
      dates.length > 0 &&
      JSON.stringify(dates) !== JSON.stringify(selectedDates)
    ) {
      setSelectedDates(dates);
    }
  }, [dates, selectedDates]);

  // Force update isValid verification on component mount
  useEffect(() => {
    onDateChange(selectedDates, isValid);
  }, [selectedDates, isValid, onDateChange]);

  // Mémoisation du handleDateSelect pour éviter les re-créations inutiles
  const handleDateSelect = useCallback(
    (dates: Date[] | undefined) => {
      if (dates) {
        setSelectedDates(dates);
        onDateChange(dates, isValid);
      } else {
        setSelectedDates([]);
        onDateChange([], isValid);
      }
    },
    [isValid, onDateChange]
  );

  // Mémoisation du handleValidityChange
  const handleValidityChange = useCallback(
    (valid: boolean) => {
      setIsValid(valid);
      onDateChange(selectedDates, valid);
    },
    [selectedDates, onDateChange]
  );

  return (
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
          onSelect={handleDateSelect}
          onValidityChange={handleValidityChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DayPicker;
