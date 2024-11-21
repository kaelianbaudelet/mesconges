"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data: Users[] = [
  {
    id: "eb4499c4-6bd2-44be-aa28-9675d344bcd5",
    firstname: "Ken",
    lastname: "Mayer",
    role: "user",

    email: "ken99@yahoo.com",
  },
];

export type Users = {
  id: string;
  firstname: string;
  lastname: string;
  role: "admin" | "user";
  email: string;
};

const DeleteAccountDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log("Compte supprimé");
    setIsOpen(false); // Ferme la modal
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        className="relative w-full flex cursor-default select-none items-center gap-2 font-semibold hover:text-white hover:bg-destructive rounded-md px-2 py-1.5 text-sm outline-none transition-colors"
        onClick={() => setIsOpen(true)}
      >
        Supprimer
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous sûr de vouloir supprimer ce compte ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Une fois confirmée, le compte sera
            supprimé de façon permanente et toutes ses données seront
            définitivement perdues.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Annuler
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<Users>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => {
      return (
        <Button
          className="px-0 py-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prenom
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("firstname")}</div>,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => {
      return (
        <Button
          className="px-0 py-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("lastname")}</div>,
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          className="px-0 py-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          className="px-0 py-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("role") === "user" ? "Utilisateur" : "Administrateur"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,

    cell: ({ row }) => {
      const Users = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="my-2 p-0 h-5">
              <svg
                className="h-5 w-5 fill-black"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z" />
                <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" />
                <path d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(Users.id)}
            >
              Copier l'ID
            </DropdownMenuItem>
            {Users.role === "user" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <DeleteAccountDialog />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const UserListCard: React.FC = () => {
  const handleMassDelete = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    console.log(
      "Utilisateurs sélectionnés pour suppression :",
      selectedRows.map((row) => row.original)
    );
  };
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col p-5 leading-6 text-black bg-white rounded-xl border border-gray-200 border-solid">
      <div className="flex justify-between items-center text-black">
        <h2 className="inline-block m-0 font-semibold text-black">
          Utilisateurs
        </h2>
      </div>
      <div className="flex py-4 gap-5 w-full">
        <Input
          className="w-full"
          placeholder="Rechercher un utilisateur"
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
          }}
        />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                Actions de masse
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleMassDelete}
                disabled={table.getSelectedRowModel().rows.length === 0}
              >
                Supprimer la sélection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        <p className="flex-1 text-[0.7rem] sm:text-sm text-muted-foreground leading-4">
          Page{" "}
          <span className="font-semibold">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          sur <span className="font-semibold">{table.getPageCount()}</span> -{" "}
          <span className="font-semibold">
            {table.getRowModel().rows.length}
          </span>{" "}
          utilisateur(s)
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
};
