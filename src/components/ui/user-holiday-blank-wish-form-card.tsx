import React from "react";

export function UserHolidayBlankWishFormCard() {
  return (
    <div className="min-h-96 border border-zinc-200 rounded-2xl justify-center items-center flex flex-col p-4">
      <h1 className="text-xl font-semibold leading-7 mb-4 text-center">
        Il n&apos;y a pas de campagne en cours
      </h1>
      <p className="text-zinc-500 text-sm font-medium text-center">
        Actuellement, aucune campagne de souhaits de congés n&apos;est en cours.
        Revenez lors de la prochaine campagne pour soumettre vos voeux de
        congés.
      </p>
    </div>
  );
}
