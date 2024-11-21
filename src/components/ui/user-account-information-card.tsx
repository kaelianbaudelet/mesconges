import React from "react";

const UserAccountInformationCard: React.FC = () => {
  // Données utilisateur
  const userInfo = [
    { label: "ID de compte", value: "c59d1161-418b-4604-ab4a-be2fe80acd45" },
    { label: "Role", value: "Utilisateur" },
    { label: "Nom", value: "Kaelian BAUDELET" },
    { label: "Email", value: "aconique@gmail.com" },
  ];

  // URL de l'avatar
  const avatarUrl =
    "https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=320&amp;h=320&amp;q=80";

  return (
    <>
      <div className="px-5 pt-5 pb-0 bg-white rounded-xl border border-zinc-200 border-solid">
        <img
          className="object-cover w-full h-44 rounded-xl"
          src="https://www.scapartois.leclerc/wp-content/uploads/2022/03/1330639014-4d201b2e81499820b5b43f915ce0e9500d1b5c2d97732163c4e85d8590048bca-d.jpg"
          alt="Hero Image"
        />

        <div className="-mt-24">
          <div className="flex relative mx-auto w-32 h-32 rounded-full border-4 border-white border-solid">
            <img
              className="block object-cover w-full max-w-full h-full align-middle rounded-full"
              src={avatarUrl}
              alt="User Avatar"
            />
          </div>

          <div className="mt-3 pb-5 text-center">
            <h1 className="m-0 text-xl font-semibold leading-7 text-black">
              Kaelian BAUDELET
            </h1>
            <p className="m-0 text-zinc-500">
              c59d1161-418b-4604-ab4a-be2fe80acd45
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 border rounded-2xl mt-5">
        {/* Liste des informations utilisateur */}
        {userInfo.map((item, index) => (
          <div
            key={index}
            className={`${
              index === 0 ? "border-t-0" : "pt-5 mt-5"
            } border-b-0 border-t border-zinc-200 border-solid border-x-0`}
          >
            <div className="flex-grow">
              <span className="block text-sm font-medium leading-5 text-black">
                {item.label}
              </span>
              <span className="block text-sm leading-5 text-zinc-500">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserAccountInformationCard;
