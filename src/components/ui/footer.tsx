import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="max-w-[1110px] flex flex-wrap basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      <div className="w-full py-6 border-t border-gray-200">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xs text-zinc-500 font-medium">
            © 2025 Mes congés
          </p>
          <p className="text-xs text-zinc-500 font-medium">V1.0.1</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
