"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { FC } from "react";
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
import { toast } from "react-hot-toast";
import { getUsers } from "@/app/actions/getUsers";
import { deleteUsers } from "@/app/actions/deleteUsers";
import { useCallback, useEffect, useState } from "react";

type Users = {
  id: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
  email: string;
};

const MassDeleteDialog = ({
  selectedUsers,
  onClose,
  onConfirm,
}: {
  selectedUsers: Users[];
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Êtes-vous sûr de vouloir supprimer {selectedUsers.length}{" "}
          utilisateur(s) ?
        </AlertDialogTitle>

        <p className="text-sm text-zinc-500">
          Cette action est irréversible. Les comptes suivants seront supprimés
          de façon permanente :
        </p>
        <div className="max-h-40 overflow-y-auto border rounded-md text-sm">
          {selectedUsers.map((user: Users) => (
            <div key={user.id} className="py-1 px-2 hover:bg-zinc-100 rounded">
              {user.firstName} {user.lastName} {user.email}
            </div>
          ))}
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
        <Button variant="destructive" onClick={onConfirm}>
          Supprimer
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const UserActionsCell: FC<{
  user: Users;
  onDelete: (userId: string) => Promise<void>;
}> = ({
  user,
  onDelete,
}: {
  user: Users;
  onDelete: (userId: string) => Promise<void>;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Menu</span>
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z"
                fill="#000000"
              />
              <path
                d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                fill="#000000"
              />
              <path
                d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z"
                fill="#000000"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(user.id)}
          >
            Copier l&apos;ID
          </DropdownMenuItem>

          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
              Supprimer
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Une fois confirmée, le compte sera
              supprimé de façon permanente et toutes ses données seront
              définitivement perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                await onDelete(user.id);
                setIsDeleteDialogOpen(false);
              }}
            >
              Supprimer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const UserListCard: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers();

      if (response.users) {
        setUsers(response.users);
      } else {
        toast.error("Erreur lors du chargement des utilisateurs");
      }
    } catch {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSingleDelete = useCallback(
    async (userId: string) => {
      try {
        const result = await deleteUsers([userId]);
        if (result.success) {
          toast.success("Utilisateur supprimé avec succès");
          await fetchUsers();
        } else {
          toast.error("Erreur lors de la suppression");
        }
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    },
    [fetchUsers]
  );

  const columns = React.useMemo<ColumnDef<Users>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        accessorKey: "firstName",
        header: ({ column }) => {
          return (
            <Button
              className="px-0 py-0"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Prenom
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
      },
      {
        accessorKey: "lastName",
        header: ({ column }) => {
          return (
            <Button
              className="px-0 py-0"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Nom
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              className="px-0 py-0"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
        cell: ({ row }) => (
          <UserActionsCell user={row.original} onDelete={handleSingleDelete} />
        ),
      },
    ],
    [handleSingleDelete]
  );

  const table = useReactTable({
    data: users,
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

  const selectedUsers = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleMassDelete = async () => {
    const selectedUserIds = selectedUsers.map((user) => user.id);
    try {
      const result = await deleteUsers(selectedUserIds);
      if (result.success) {
        toast.success(result.success);
        await fetchUsers();
        setIsDeleteDialogOpen(false);
        setRowSelection({});
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full relative">
        <div className="spinner spinner-xl"></div>
      </div>
    );
  }

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
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={selectedUsers.length === 0}
                >
                  Supprimer la sélection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedUsers.length > 0 && (
              <MassDeleteDialog
                selectedUsers={selectedUsers}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleMassDelete}
              />
            )}
          </AlertDialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
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
