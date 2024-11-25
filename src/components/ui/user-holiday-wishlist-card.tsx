"use client";
import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import ExportButton from "@/components/ui/export-button";

import { getUserHolidayWishes } from "@/app/actions/getUserHolidayWishes";

export type HolidayWishesRow = {
  id: string;
  situation: string;
  firstname: string;
  lastname: string;
  email: string;
  childrenCount: number;
  campaignStartDate: string;
  campaignEndDate: string;
  wish1: string[];
  wish2: string[];
  wish3: string[];
};

type UserData = HolidayWishesRow & { children: number };

const UserHolidayWishlistCard = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const userWishes = await getUserHolidayWishes();

        // Ajouter un console.log pour déboguer
        console.log("Raw user wishes:", userWishes);

        type Wish = {
          wish1: { date: Date }[];
          wish2: { date: Date }[];
          wish3: { date: Date }[];
          childrenCount: number;
          familyStatus: string;
          campaign: { startDate: Date; endDate: Date };
        };

        type User = {
          id: string;
          firstName: string;
          lastName: string;
          email: string;
          wishes: Wish[];
        };

        const filteredData = userWishes.filter((user: User) =>
          user.wishes.some(
            (wish: Wish) =>
              wish.wish1.length > 0 &&
              wish.wish2.length > 0 &&
              wish.wish3.length > 0 &&
              wish.campaign?.startDate &&
              wish.campaign?.endDate
          )
        );

        const formattedData = filteredData.map((user: User) => {
          return {
            id: user.id,
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            childrenCount: Number(user.wishes[0]?.childrenCount) || 0,
            situation:
              user.wishes[0]?.familyStatus === "isolated" ? "Isolé" : "Famille",
            campaignStartDate:
              user.wishes[0]?.campaign?.startDate?.toISOString() || "",
            campaignEndDate:
              user.wishes[0]?.campaign?.endDate?.toISOString() || "",
            wish1:
              user.wishes[0]?.wish1.map((date: { date: Date }) =>
                date.date.toISOString()
              ) || [],
            wish2:
              user.wishes[0]?.wish2.map((date: { date: Date }) =>
                date.date.toISOString()
              ) || [],
            wish3:
              user.wishes[0]?.wish3.map((date: { date: Date }) =>
                date.date.toISOString()
              ) || [],
          };
        });
        type UserData = HolidayWishesRow & { children: number };
        const userData: UserData[] = formattedData.map((item) => ({
          ...item,
          children: item.childrenCount,
        }));
        setData(userData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns: ColumnDef<HolidayWishesRow>[] = [
    {
      accessorKey: "firstname",
      header: "Prénom",
      cell: ({ row }) => <div>{row.getValue("firstname")}</div>,
    },
    {
      accessorKey: "lastname",
      header: "Nom",
      cell: ({ row }) => <div>{row.getValue("lastname")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "childrenCount",
      header: "Nb. d'enfants",
      cell: ({ row }) => <div>{row.getValue("childrenCount")}</div>,
    },
    {
      accessorKey: "situation",
      header: "Situation",
      cell: ({ row }) => <div>{row.getValue("situation")}</div>,
    },
    {
      accessorKey: "wish1",
      header: "Vœu 1",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-6 px-2.5 my-1.5"
            >
              Voir les dates
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Liste des dates sélectionnées par {row.getValue("firstname")}{" "}
                {row.getValue("lastname")} pour le voeu n°1
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 overflow-y-scroll">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                  {(row.getValue("wish1") as string[]).map(
                    (date: string, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-zinc-500">
                          {new Date(date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      accessorKey: "wish2",
      header: "Vœu 2",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-6 px-2.5 my-1.5"
            >
              Voir les dates
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Liste des dates sélectionnées par {row.getValue("firstname")}{" "}
                {row.getValue("lastname")} pour le voeu n°2
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 overflow-y-scroll">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                  {(row.getValue("wish2") as string[]).map(
                    (date: string, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-zinc-500">
                          {new Date(date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      accessorKey: "wish3",
      header: "Vœu 3",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-6 px-2.5 my-1.5"
            >
              Voir les dates
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Liste des dates sélectionnées par {row.getValue("firstname")}{" "}
                {row.getValue("lastname")} pour le voeu n°3
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 overflow-y-scroll">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                  {(row.getValue("wish3") as string[]).map(
                    (date: string, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-zinc-500">
                          {new Date(date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns, // Utiliser les colonnes exportées
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full relative">
        <div className="spinner spinner-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 gap-5 flex-col flex">
      <div className="justify-between flex gap-8">
        <h2 className="inline-block m-0 font-semibold text-black">
          Voeux de congès par utilisateur
        </h2>
        <ExportButton data={data} />
      </div>

      <Input
        placeholder="Rechercher un collaborateur..."
        value={table.getState().globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
      />
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
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
                Aucun résultat trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserHolidayWishlistCard;
