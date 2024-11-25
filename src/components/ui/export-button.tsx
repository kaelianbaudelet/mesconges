import React from "react";
import * as XLSX from "xlsx-js-style";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserData = {
  id: string;
  situation: string;
  firstname: string;
  lastname: string;
  email: string;
  children: number;
  wish1: string[];
  wish2: string[];
  wish3: string[];
  [key: `wish${number}`]: string[];
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

const prepareWorksheet = (data: UserData[]) => {
  const allDates = new Set<string>();
  data.forEach((row) => {
    [...row.wish1, ...row.wish2, ...row.wish3].forEach((date) =>
      allDates.add(date)
    );
  });
  const sortedDates = Array.from(allDates).sort();

  const rows: (string | number)[][] = [
    [
      "Prénom",
      "Nom",
      "Email",
      "Situation",
      "Nb. d'enfants",
      "Voeu",
      ...sortedDates.map(formatDate),
    ],
  ];

  data.forEach((row) => {
    for (let wishIndex = 1; wishIndex <= 3; wishIndex++) {
      const wishDates = row[`wish${wishIndex}`];
      const rowData = [
        row.firstname,
        row.lastname,
        row.email,
        row.situation,
        row.children,
        `Voeu N°${wishIndex}`,
        ...sortedDates.map((date) =>
          wishDates.includes(date) ? wishIndex : ""
        ),
      ];
      rows.push(rowData);
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  const columnWidths = new Array(rows[0].length).fill({ width: 15 });
  worksheet["!cols"] = columnWidths;

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "0066CC" } },
  };

  const userStyles = [
    {
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "F09A38" } },
    },
    {
      font: { bold: true, color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "F4B66E" } },
    },
  ];

  for (let col = 0; col < rows[0].length; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    worksheet[cellRef].s = headerStyle;
  }

  for (let row = 1; row < rows.length; row++) {
    const styleIndex = Math.floor((row - 1) / 3) % 2;
    for (let col = 0; col < rows[row].length; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      worksheet[cellRef].s = userStyles[styleIndex];
    }
  }

  return worksheet;
};

const exportFunctions = {
  xlsx: (data: UserData[], filename = "voeux_utilisateurs.xlsx") => {
    const worksheet = prepareWorksheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voeux");
    XLSX.writeFile(workbook, filename);
  },

  wk3: (data: UserData[], filename = "voeux_utilisateurs.wk3") => {
    const worksheet = prepareWorksheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voeux");
    XLSX.writeFile(workbook, filename);
  },

  csv: (data: UserData[], filename = "voeux_utilisateurs.csv") => {
    const worksheet = prepareWorksheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  },

  html: (data: UserData[], filename = "voeux_utilisateurs.html") => {
    const worksheet = prepareWorksheet(data);
    const html = XLSX.utils.sheet_to_html(worksheet);

    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  },

  txt: (data: UserData[], filename = "voeux_utilisateurs.txt") => {
    const worksheet = prepareWorksheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voeux");
    XLSX.writeFile(workbook, filename);
  },
};

const exportData = (
  fileType: keyof typeof exportFunctions,
  data: UserData[],
  filename?: string
) => {
  const exportFunction = exportFunctions[fileType];
  if (!exportFunction) {
    throw new Error(`Unsupported export type: ${fileType}`);
  }

  const formattedDate = new Date()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");
  const defaultFilename = `voeux_utilisateurs_${formattedDate}.${fileType}`;

  exportFunction(data, filename || defaultFilename);
};

const ExportButton: React.FC<{ data: UserData[] }> = ({ data }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-xs" size="sm">
          Exporter
          <svg
            className="flex-shrink-0 w-4 h-4 fill-black"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M324.288,389.972c-12.581,0-22.774,10.193-22.774,22.757c0,12.564,10.193,22.758,22.774,22.758   c12.564,0,22.757-10.193,22.757-22.758C347.045,400.165,336.852,389.972,324.288,389.972z"></path>
            <path d="M400.592,389.972c-12.58,0-22.773,10.193-22.773,22.757c0,12.564,10.194,22.758,22.773,22.758   c12.564,0,22.758-10.193,22.758-22.758C423.35,400.165,413.156,389.972,400.592,389.972z"></path>
            <path d="M475.735,323.135l-82.965-68.11c-15.386-12.613-34.676-19.524-54.595-19.524h-26.644l-23.128,25.709   c-8.258,9.161-20.064,14.419-32.403,14.419c-12.338,0-24.144-5.258-32.402-14.419l-23.128-25.709h-26.66   c-19.902,0-39.192,6.911-54.579,19.524l-82.964,68.11C18.491,335.989,6.879,356.852,6.879,380.48v60.708   c0.016,39.12,31.693,70.804,70.804,70.812H256H434.3c39.112-0.008,70.82-31.693,70.82-70.812V380.48   C505.121,356.852,493.509,335.989,475.735,323.135z M464.654,441.188c0,8.444-3.371,15.903-8.886,21.459   c-5.548,5.516-13.016,8.879-21.468,8.887H77.683c-8.435-0.008-15.903-3.371-21.451-8.887c-5.532-5.556-8.886-13.015-8.886-21.459   V380.48c0-8.443,3.354-15.91,8.886-21.45c5.548-5.524,13.016-8.887,21.451-8.895H434.3c8.452,0.008,15.919,3.371,21.468,8.895   c5.516,5.54,8.886,13.008,8.886,21.45V441.188z"></path>
            <path d="M242.017,244.637c3.564,3.96,8.661,6.218,13.983,6.218c5.339,0,10.42-2.258,13.984-6.218l71.53-79.489   c4.984-5.516,6.226-13.451,3.21-20.241c-3.016-6.782-9.758-11.153-17.177-11.153h-33.612V18.814C293.934,8.428,285.499,0,275.112,0   h-38.224c-10.387,0-18.806,8.428-18.806,18.814v114.94H184.47c-7.419,0-14.16,4.371-17.192,11.153   c-3.016,6.79-1.758,14.725,3.21,20.241L242.017,244.637z"></path>
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <DropdownMenuLabel className="py-2 items-center text-center flex">
          Exporter les voeux
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2 h-full leading-6 text-black">
          <p className="m-0 text-xs leading-4 text-zinc-500">
            Exporter les voeux de congès des utilisateurs de la campagne en
            cours. Vous pouvez choisir le format de fichier que vous souhaitez
            exporter.
          </p>

          <p className="mt-3 mx-0 mb-0 text-xs font-semibold leading-4 text-zinc-500 uppercase">
            Exporter les données au format:
          </p>

          <div className="flex gap-x-3 items-center pt-4 mt-4 mb-0 w-full text-black border-b-0 border-t border-gray-200 border-solid border-x-0">
            <svg
              className="block flex-shrink-0 w-7 h-7 align-middle"
              viewBox="-4 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.131-.001c-2.801 0-5.072 2.272-5.072 5.074v53.841c0 2.803 2.271 5.074 5.072 5.074h45.775c2.801 0 5.074-2.271 5.074-5.074v-38.605l-18.904-20.31h-31.945z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#20A971"
              />

              <path
                d="M10.107 37.466v16.419h21.521v-16.419h-21.521zm6.458 15.078h-4.967v-3.58h4.967v3.58zm0-5.012h-4.967v-3.579h4.967v3.579zm0-5.011h-4.967v-3.58h4.967v3.58zm13.632 10.023h-12.155v-3.58h12.155v3.58zm0-5.012h-12.155v-3.579h12.155v3.579zm0-5.011h-12.155v-3.58h12.155v3.58z"
                fill="#ffffff"
              />

              <g fillRule="evenodd" clipRule="evenodd">
                <path
                  d="M55.98 20.32v1h-12.801s-6.312-1.26-6.127-6.707c0 0 .207 5.707 6.002 5.707h12.926z"
                  fill="#189355"
                />

                <path
                  d="M37.076-.031v14.561c0 1.656 1.104 5.791 6.104 5.791h12.801l-18.905-20.352z"
                  opacity=".5"
                  fill="#ffffff"
                />
              </g>
            </svg>

            <div className="flex-grow">
              <span className="block text-sm font-medium leading-5 text-black">
                XLSX
              </span>
              <span className="-mt-1 block text-xs leading-5 text-zinc-500">
                Fichier Microsoft Excel
              </span>
            </div>
            <Button
              className="text-xs"
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const formattedDate = `${today.getFullYear()}`;
                exportData(
                  "xlsx",
                  data,
                  `voeux_utilisateurs_SCAPARTOIS_${formattedDate}.xlsx`
                );
              }}
            >
              Exporter en .XLSX
            </Button>
          </div>
          <div className="flex gap-x-3 items-center pt-4 mt-4 mb-0 w-full text-black border-b-0 border-t border-gray-200 border-solid border-x-0">
            <svg
              className="block flex-shrink-0 w-7 h-7 align-middle"
              viewBox="-4 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.131-.001c-2.801 0-5.072 2.272-5.072 5.074v53.841c0 2.803 2.271 5.074 5.072 5.074h45.775c2.801 0 5.074-2.271 5.074-5.074v-38.605l-18.904-20.31h-31.945z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#20A971"
              />

              <path
                d="M10.107 37.466v16.419h21.521v-16.419h-21.521zm6.458 15.078h-4.967v-3.58h4.967v3.58zm0-5.012h-4.967v-3.579h4.967v3.579zm0-5.011h-4.967v-3.58h4.967v3.58zm13.632 10.023h-12.155v-3.58h12.155v3.58zm0-5.012h-12.155v-3.579h12.155v3.579zm0-5.011h-12.155v-3.58h12.155v3.58z"
                fill="#ffffff"
              />

              <g fillRule="evenodd" clipRule="evenodd">
                <path
                  d="M55.98 20.32v1h-12.801s-6.312-1.26-6.127-6.707c0 0 .207 5.707 6.002 5.707h12.926z"
                  fill="#189355"
                />

                <path
                  d="M37.076-.031v14.561c0 1.656 1.104 5.791 6.104 5.791h12.801l-18.905-20.352z"
                  opacity=".5"
                  fill="#ffffff"
                />
              </g>
            </svg>

            <div className="flex-grow">
              <span className="block text-sm font-medium leading-5 text-black">
                CSV
              </span>
              <span className="-mt-1 block text-xs leading-5 text-zinc-500">
                Fichier CSV
              </span>
            </div>
            <Button
              className="text-xs"
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const formattedDate = `${today.getFullYear()}`;
                exportData(
                  "csv",
                  data,
                  `voeux_utilisateurs_SCAPARTOIS_${formattedDate}.csv`
                );
              }}
            >
              Exporter en .CSV
            </Button>
          </div>
          <div className="flex gap-x-3 items-center pt-4 mt-4 mb-0 w-full text-black border-b-0 border-t border-gray-200 border-solid border-x-0">
            <svg
              className="block flex-shrink-0 w-7 h-7 align-middle"
              viewBox="-4 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.131-.001c-2.801 0-5.072 2.272-5.072 5.074v53.841c0 2.803 2.271 5.074 5.072 5.074h45.775c2.801 0 5.074-2.271 5.074-5.074v-38.605l-18.904-20.31h-31.945z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#20A971"
              />

              <path
                d="M10.107 37.466v16.419h21.521v-16.419h-21.521zm6.458 15.078h-4.967v-3.58h4.967v3.58zm0-5.012h-4.967v-3.579h4.967v3.579zm0-5.011h-4.967v-3.58h4.967v3.58zm13.632 10.023h-12.155v-3.58h12.155v3.58zm0-5.012h-12.155v-3.579h12.155v3.579zm0-5.011h-12.155v-3.58h12.155v3.58z"
                fill="#ffffff"
              />

              <g fillRule="evenodd" clipRule="evenodd">
                <path
                  d="M55.98 20.32v1h-12.801s-6.312-1.26-6.127-6.707c0 0 .207 5.707 6.002 5.707h12.926z"
                  fill="#189355"
                />

                <path
                  d="M37.076-.031v14.561c0 1.656 1.104 5.791 6.104 5.791h12.801l-18.905-20.352z"
                  opacity=".5"
                  fill="#ffffff"
                />
              </g>
            </svg>

            <div className="flex-grow">
              <span className="block text-sm font-medium leading-5 text-black">
                WK3
              </span>
              <span className="-mt-1 block text-xs leading-5 text-zinc-500">
                Fichier Lotus 1-2-3
              </span>
            </div>
            <Button
              className="text-xs"
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const formattedDate = `${today.getFullYear()}`;
                exportData(
                  "wk3",
                  data,
                  `voeux_utilisateurs_SCAPARTOIS_${formattedDate}.wk3`
                );
              }}
            >
              Exporter en .WK3
            </Button>
          </div>
          <div className="flex gap-x-3 items-center pt-4 mt-4 mb-0 w-full text-black border-b-0 border-t border-gray-200 border-solid border-x-0">
            <svg
              className="block flex-shrink-0 w-7 h-7 align-middle"
              viewBox="-4 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.135.008c-2.803 0-5.074 2.272-5.074 5.074v53.84c0 2.803 2.271 5.074 5.074 5.074h45.775c2.801 0 5.074-2.271 5.074-5.074v-38.605l-18.903-20.309h-31.946z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#F7622C"
              />

              <g fillRule="evenodd" clipRule="evenodd">
                <path
                  d="M55.976 20.352v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z"
                  fill="#F54921"
                />

                <path
                  d="M37.074 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z"
                  opacity=".5"
                  fill="#ffffff"
                />
              </g>

              <path
                d="M18.942 50.841c-.126 0-.231-.021-.336-.063l-7.58-3.38c-.483-.21-.798-.714-.798-1.28 0-.504.315-1.008.798-1.219l7.58-3.4c.105-.043.21-.063.336-.063.441 0 .882.356.882.903 0 .336-.189.672-.525.818l-7.034 3.002 7.034 2.982c.336.146.525.461.525.818 0 .546-.462.882-.882.882zm8.464-11.044l-4.43 13.291c-.126.398-.504.629-.903.629-.525 0-.924-.398-.924-.881 0-.105.021-.189.063-.295l4.43-13.29c.126-.378.483-.63.903-.63.525 0 .903.42.903.902l-.042.274zm10.184 7.6l-7.58 3.38c-.105.043-.231.063-.336.063-.441 0-.882-.356-.882-.882 0-.357.189-.672.525-.818l7.034-2.982-7.034-3.002c-.357-.146-.546-.482-.546-.818-.021-.547.441-.903.903-.903.105 0 .231.021.336.063l7.58 3.4c.483.211.798.715.798 1.219 0 .567-.315 1.071-.798 1.28z"
                fill="#ffffff"
              />
            </svg>
            <div className="flex-grow">
              <span className="block text-sm font-medium leading-5 text-black">
                HTML
              </span>
              <span className="-mt-1 block text-xs leading-5 text-zinc-500">
                Fichier HTML
              </span>
            </div>
            <Button
              className="text-xs"
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const formattedDate = `${today.getFullYear()}`;
                exportData(
                  "html",
                  data,
                  `voeux_utilisateurs_SCAPARTOIS_${formattedDate}.html`
                );
              }}
            >
              Exporter en .HTML
            </Button>
          </div>
          <div className="flex gap-x-3 items-center pt-4 mt-4 mb-0 w-full text-black border-b-0 border-t border-gray-200 border-solid border-x-0">
            <svg
              className="block flex-shrink-0 w-7 h-7 align-middle"
              viewBox="-4 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fillRule="evenodd" clipRule="evenodd">
                <path
                  d="M5.113.007c-2.803 0-5.074 2.271-5.074 5.074v53.84c0 2.803 2.271 5.074 5.074 5.074h45.774c2.801 0 5.074-2.271 5.074-5.074v-38.606l-18.903-20.308h-31.945z"
                  fill="#8199AF"
                />

                <path
                  d="M55.976 20.352v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z"
                  fill="#617F9B"
                />

                <path
                  d="M37.074 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z"
                  opacity=".5"
                  fill="#ffffff"
                />
              </g>
            </svg>
            <div className="flex-grow">
              <span className="block text-sm font-medium leading-5 text-black">
                TXT
              </span>
              <span className="-mt-1 block text-xs leading-5 text-zinc-500">
                Fichier TXT
              </span>
            </div>
            <Button
              className="text-xs"
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const formattedDate = `${today.getFullYear()}`;
                exportData(
                  "txt",
                  data,
                  `voeux_utilisateurs_SCAPARTOIS_${formattedDate}.txt`
                );
              }}
            >
              Exporter en .TXT
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
