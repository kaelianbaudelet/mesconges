import React from "react";

const CampaignStatsCard: React.FC = () => {
  return (
    <div className="flex flex-col p-5 leading-6 text-black bg-white rounded-xl border border-gray-200 border-solid">
      <div className="flex justify-between items-center text-black">
        <h2 className="inline-block m-0 font-semibold text-black">
          Information de la campagne
        </h2>
      </div>

      <div className="grid gap-4 mt-3 mb-0 text-black sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col p-4 rounded-xl border border-gray-200 border-solid">
          <h2 className="m-0 text-sm leading-5 text-zinc-500">
            Utilisateurs au total
          </h2>

          <div className="flex gap-x-1.5 items-center">
            <p className="m-0 text-xl font-semibold leading-7 text-black">
              456
            </p>
          </div>
        </div>

        <div className="flex flex-col p-4 rounded-xl border border-gray-200 border-solid">
          <h2 className="m-0 text-sm leading-5 text-zinc-500">Congés soumis</h2>

          <div className="flex gap-x-1.5 items-center">
            <p className="m-0 text-xl font-semibold leading-7 text-black">
              441
            </p>
          </div>
        </div>

        <div className="flex flex-col p-4 rounded-xl border border-gray-200 border-solid">
          <h2 className="m-0 text-sm leading-5 text-zinc-500">
            Congés en attente
          </h2>

          <div className="flex gap-x-1.5 items-center">
            <p className="m-0 text-xl font-semibold leading-7 text-black">15</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col p-4 rounded-xl border border-gray-200 border-solid">
        <h2 className="m-0 text-sm leading-5 text-zinc-500">
          Période de la campagne de voeux
        </h2>

        <div className="flex gap-x-1.5 items-center">
          <p className="m-0 text-md font-semibold leading-7 text-black">
            13/03/2022 au 13/04/2022
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignStatsCard;
