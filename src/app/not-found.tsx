import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const NotFound: React.FC = () => {
  return (
    <section className="h-screen flex justify-center items-center relative py-8 before:absolute before:left-1/2 before:top-0 before:-z-10 before:h-full before:w-2/3 before:-translate-x-1/2 before:rounded-full before:bg-primary/15 before:blur-3xl lg:py-12 xl:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto flex flex-col items-center justify-center gap-y-5 text-center sm:w-5/6 md:w-5/6 lg:gap-y-6">
          <div className="space-y-4 lg:space-y-5">
            <h1 className="text-4xl font-bold text-black lg:text-5xl lg:leading-tight">
              {" "}
              Zut ! C&apos;est une
              <br />
            </h1>
            <Image
              src="/404.png"
              className="h-auto w-64 mx-auto"
              alt="Illustration d'une page 404"
              width={600}
              height={400}
            />
            <p className="mx-auto w-11/12 text-zinc-500 sm:w-4/5 lg:text-lg lg:leading-normal xl:text-xl">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été
              déplacée.
            </p>
          </div>
          <div className="mt-10 flex flex-col space-y-5 px-8 sm:flex-row sm:items-center sm:justify-center sm:space-x-5 sm:space-y-0 sm:px-0">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/">Retour au dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
