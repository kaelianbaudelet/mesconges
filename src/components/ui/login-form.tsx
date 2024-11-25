// app/login/components/LoginForm.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || null;

  let errorMessage = null;
  if (error === "unauthorized") {
    errorMessage =
      "La connexion avec un mail personnel n'est pas autorisée, veuillez utiliser votre compte Google Workspace à la place.";
  }
  if (error === "invalid_claims") {
    errorMessage =
      "Une erreur lié à votre compte Google Workspace est survenue, il est possible que vous n'ayez pas les autorisations nécessaires pour accéder à cette application.";
  }
  if (error === "missing_code") {
    errorMessage =
      "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
  }
  if (error === "invalid_state") {
    errorMessage =
      "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
  }
  if (error === "invalid_code") {
    errorMessage =
      "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
  }

  return (
    <div className="flex flex-wrap h-screen">
      <div className="w-full lg:w-1/2 p-6">
        <div className="flex flex-col justify-center py-24 max-w-md mx-auto h-full">
          <h1 className="text-3xl font-semibold font-heading mb-4">
            Connexion
          </h1>

          <p className="text-gray-800 text-xs mb-6">
            Pour accéder à votre espace&nbsp;
            <span className="font-bold">E.Leclerc SCAPARTOIS MesCongés</span>
            &nbsp;et déposer vos souhaits de congés, connectez-vous avec votre
            compte Google Workspace.
          </p>

          {errorMessage && (
            <p className="text-red-500 font-semibold text-sm mb-4">
              {errorMessage}
            </p>
          )}

          <form action="/login/google" method="get">
            <button
              type="submit"
              className="h-14 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-white w-full text-center border border-gray-200/90 hover:bg-gray-50 focus:ring-8 focus:ring-[#f0f0f0] transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
              >
                <path
                  d="M10.5003 1.91667C12.5358 1.91667 14.3903 2.67493 15.8117 3.91839L13.8037 5.92643C12.9021 5.19326 11.7542 4.75001 10.5003 4.75001C7.601 4.75001 5.25033 7.10068 5.25033 10C5.25033 12.8993 7.601 15.25 10.5003 15.25C12.7863 15.25 14.7244 13.7867 15.4456 11.7501L15.5636 11.4167H15.2099H10.7503V8.58334H17.7503V8.61792H18.0003H18.4637C18.5415 9.06752 18.5837 9.52907 18.5837 10C18.5837 14.464 14.9643 18.0833 10.5003 18.0833C6.03631 18.0833 2.41699 14.464 2.41699 10C2.41699 5.53599 6.03631 1.91667 10.5003 1.91667Z"
                  fill="#FFC107"
                  stroke="#FFC107"
                  strokeWidth="0.5"
                ></path>
                <path
                  d="M3.12793 6.12125L5.86585 8.12917C6.60668 6.29501 8.40085 5.00001 10.5004 5.00001C11.775 5.00001 12.9346 5.48084 13.8175 6.26625L16.1746 3.90917C14.6863 2.52209 12.6954 1.66667 10.5004 1.66667C7.2996 1.66667 4.52376 3.47375 3.12793 6.12125Z"
                  fill="#FF3D00"
                ></path>
                <path
                  d="M10.4998 18.3333C12.6523 18.3333 14.6081 17.5096 16.0869 16.17L13.5077 13.9875C12.6429 14.6452 11.5862 15.0009 10.4998 15C8.3323 15 6.49189 13.6179 5.79855 11.6892L3.08105 13.7829C4.46022 16.4817 7.26105 18.3333 10.4998 18.3333Z"
                  fill="#4CAF50"
                ></path>
                <path
                  d="M18.6713 8.36791H18V8.33333H10.5V11.6667H15.2096C14.8809 12.5902 14.2889 13.3972 13.5067 13.9879L13.5079 13.9871L16.0871 16.1696C15.9046 16.3354 18.8333 14.1667 18.8333 9.99999C18.8333 9.44124 18.7758 8.89583 18.6713 8.36791Z"
                  fill="#1976D2"
                ></path>
              </svg>
              <span className="font-semibold text-sm">
                Connexion avec Google Workspace
              </span>
            </button>
          </form>
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:block hidden">
        <div className="bg-[#f0f0f0] h-full">
          <div className="flex flex-col justify-center items-center h-full p-32">
            {/* Contenu d'images ou autres */}
          </div>
        </div>
      </div>
    </div>
  );
}
