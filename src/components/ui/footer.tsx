import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="max-w-[1110px] flex flex-wrap basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      <div className="w-full py-6 border-t border-gray-200">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-zinc-500 font-medium">
              © 2024 E.Leclerc Mes Congés v0.0.1
            </p>
            <p className="text-[0.65rem] text-zinc-500 font-medium">
              Une application développée par{" "}
              <Link
                className="font-semibold hover:underline hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400"
                href="https://www.linkedin.com/in/kaelianbaudelet/"
                target="_blank"
              >
                Kaelian BAUDELET
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
