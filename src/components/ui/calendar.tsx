// calendar.tsx

"use client";
import React from "react";
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  isWeekend,
  differenceInCalendarDays,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { fr } from "date-fns/locale";

interface CalendarProps {
  selected: Date[];
  onSelect: (dates: Date[]) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export function Calendar({
  selected,
  onSelect,
  onValidityChange,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [errors, setErrors] = React.useState({
    minDates: true,
    maxDates: false,
    consecutive: true,
  });

  const onDateClick = (day: Date) => {
    if (isWeekend(day)) return;
    const isSelected = selected.some((date) => isSameDay(date, day));
    if (isSelected) {
      onSelect(selected.filter((date) => !isSameDay(date, day)));
    } else {
      onSelect([...selected, day].sort((a, b) => a.getTime() - b.getTime()));
    }
  };
  const nextMonth = () => {
    setCurrentMonth(addDays(currentMonth, 30));
  };
  const prevMonth = () => {
    setCurrentMonth(addDays(currentMonth, -30));
  };
  const isValidSelection = (dates: Date[]): boolean => {
    let consecutiveWorkdays = 1;
    let maxConsecutiveWorkdays = 1;
    for (let i = 1; i < dates.length; i++) {
      const daysBetween = differenceInCalendarDays(dates[i], dates[i - 1]);
      if (
        daysBetween === 1 ||
        (daysBetween === 3 && isWeekend(addDays(dates[i - 1], 1)))
      ) {
        consecutiveWorkdays++;
      } else {
        consecutiveWorkdays = 1;
      }
      maxConsecutiveWorkdays = Math.max(
        maxConsecutiveWorkdays,
        consecutiveWorkdays
      );
    }
    return maxConsecutiveWorkdays >= 10;
  };

  React.useEffect(() => {
    // Validation à chaque modification de la sélection
    const newErrors = {
      minDates: selected.length < 10,
      maxDates: selected.length > 20,
      consecutive: !isValidSelection(selected),
    };
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => !error);
    onValidityChange?.(isValid);
  }, [selected, onValidityChange]);

  React.useEffect(() => {
    // Validation à chaque modification de la sélection
    const newErrors = {
      minDates: selected.length < 10,
      maxDates: selected.length > 20,
      consecutive: !isValidSelection(selected),
    };
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => !error);
    onValidityChange?.(isValid);
  }, [selected, onValidityChange]); // Se déclenche à chaque changement dans `selected`
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={prevMonth}
          aria-label="Mois précédent"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-50 rounded-full"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20"></polygon>
          </svg>
        </Button>
        <span className="text-sm font-medium capitalize text-center">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </span>
        <Button
          onClick={nextMonth}
          aria-label="Mois suivant"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-50 rounded-full"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="8 18.612 14.1888889 12.5 8 6.37733333 9.91111111 4.5 18 12.5 9.91111111 20.5"></polygon>
          </svg>
        </Button>
      </div>
    );
  };
  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { locale: fr });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className="text-muted-foreground rounded-md w-7 font-normal text-[0.8rem] capitalize text-center"
        >
          {format(addDays(startDate, i), "EE", { locale: fr })}
        </div>
      );
    }
    return <div className="flex justify-between">{days}</div>;
  };
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const endDate = endOfWeek(monthEnd, { locale: fr });
    const rows = [];
    let days = [];
    let day = startDate;
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isWeekendDay = isWeekend(day);
        days.push(
          <button
            key={day.toString()}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 w-7 p-0 font-normal rounded-full text-xs  ${
              !isSameMonth(day, monthStart)
                ? "text-muted-foreground"
                : isWeekendDay
                ? "text-muted-foreground"
                : selected.some((date) => isSameDay(date, cloneDay))
                ? "bg-primary text-primary-foreground"
                : "cursor-pointer hover:bg-muted"
            }`}
            onClick={() => !isWeekendDay && onDateClick(cloneDay)}
            role={isWeekendDay ? undefined : "button"}
            aria-pressed={selected.some((date) => isSameDay(date, cloneDay))}
          >
            {format(day, "d", { locale: fr })}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          key={day.toString()}
          className="flex w-full mt-2 gap-x-2 justify-between"
        >
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  const renderErrorMessage = (condition: boolean, message: string) => (
    <div
      className={`flex items-center gap-2 ${
        condition ? "stroke-destructive " : "stroke-primary"
      }`}
    >
      {condition ? (
        <svg
          width="20px"
          height="20px"
          className="flex-shrink-0 h-4 w-4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="12"
            x2="12"
            y1="8"
            y2="12"
          />
          <line
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="12"
            x2="12"
            y1="16"
            y2="16"
          />
          <circle
            cx="12"
            cy="12"
            data-name="--Circle"
            fill="none"
            id="_--Circle"
            r="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ) : (
        <svg
          width="20px"
          height="20px"
          className="flex-shrink-0 h-4 w-4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            fill="none"
            points="3.7 14.3 9.6 19 20.3 5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );

  return (
    <>
      <div className="p-4">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        <div className="flex flex-col border text-xs gap-y-2 p-2.5 rounded-xl mt-5">
          {renderErrorMessage(
            errors.minDates,
            "Sélectionner au moins 10 dates"
          )}
          {renderErrorMessage(
            errors.maxDates,
            "Sélectionner pas plus de 20 dates"
          )}
          {renderErrorMessage(
            errors.consecutive,
            "Sélectionner au moins 10 jours consécutifs"
          )}
        </div>
      </div>
    </>
  );
}

export default Calendar;
