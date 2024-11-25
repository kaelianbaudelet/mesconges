import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: *.googleusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

if (process.env.NODE_ENV != "development") {
  console.log(`
                                 +++++++++++++++
                             +++++++++++++++++++++++
                           -++++++++++++++++++++++++++
                         ++++++++               -++++++-
                        +++++++      ............ +++++++
                       ++++++   ++++++++ .......... ++++++
                      ++++++   +++++++++ ........... ++++++
                     ++++++    +++++++++ ............ ++++++
                     +++++       ++++++..............  +++++
                     +++++       ++++++..............  +++++
                     +++++       ++++++..............  +++++
                     +++++       ++++++..............  +++++
                     +++++       ++++++..............  +++++
                     ++++++      ++++++....-+++ ...   ++++++
                      ++++++   ++++++++++++++++ .    -+++++
                       ++++++  ++++++++++++++++     +++++++
                        +++++++++++++++++++++++   +++++++
                         ++++++++               ++++++++
                           ++++++++++++++++-++++++++++
                             +++++++++++++++++++++++
                                 +++++++++++++++

                         MES CONGES — SCAPARTOIS v1.0.0
                          © ${new Date().getFullYear()} SCAPARTOIS E.LECLERC

   —————————————————————————————————————————————————————————————————————————
   L'application est acessible à l'adresse suivante : ${
     process.env.NEXT_PUBLIC_SITE_URL
   }
   —————————————————————————————————————————————————————————————————————————

`);
}
