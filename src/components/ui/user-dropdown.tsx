"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/user";

interface UserDropdownProps {
  user: User | null;
}

function UserDropdown({ user }: UserDropdownProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end items-center bg-zinc-200 rounded-full w-max gap-x-2.5 p-1 cursor-pointer truncate">
            <span className=" text-xs font-bold text-black pl-2 max-w-20 truncate">
              {user?.name}
            </span>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback className="bg-primary text-white">
                  {user?.firstName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              // Ouvre une nouvelle pop-up sur l'URL de déconnexion
              const popup = window.open(
                "/logout",
                "_blank",
                "width=500,height=500"
              );

              // Ferme la pop-up après 2 secondes
              setTimeout(() => {
                if (popup && !popup.closed) {
                  popup.close();
                  console.log("Déconnecté avec succès");
                  // Exemple : rediriger vers la page d'accueil
                  window.location.href = "/";
                }
              }, 2000);
            }}
          >
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default UserDropdown;
