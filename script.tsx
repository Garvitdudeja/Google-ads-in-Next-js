"use client";
import { adsScript, currentPage } from "@/utils/adsTempConstant";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    googletag: {
      cmd: Array<() => void>;
      pubads: () => {
        enableSingleRequest: () => void;
        clear: () => void;
        refresh: () => void;
        destroySlots: () => void;
        addService: (service: any) => void;
      };
      sizeMapping: () => {
        addSize: (viewport: number[], sizes: number[][]) => any;
        build: () => any;
      };
      defineSlot: (
        path: string,
        size: number[][],
        id: string
      ) => {
        addService: (service: any) => any;
        defineSizeMapping?: (mapping: any) => any;
      };
      enableServices: () => void;
    };
  }
}

const RmnScript: React.FC = () => {
  const RMN_url: string | undefined = process.env.NEXT_PUBLIC_RMN_URL;
  const pathname = usePathname();
  const [selectedPath, setSelectedPath] = useState<string | null>(
    currentPage(pathname)
  );

  useEffect(() => {
    setSelectedPath(currentPage(pathname));
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.googletag) {
      const loadAds = () => {
        window.googletag.cmd.push(() => {
          // Clear existing ad slots
          if (window.googletag.pubads) {
            window.googletag.pubads().clear();
            (window as any).googletag.destroySlots();
          }

          // Define new ad slots
          if (selectedPath && Array.isArray(adsScript[selectedPath])) {
            adsScript[selectedPath].forEach((adSlot: any) => {
              const slot = window.googletag
                .defineSlot(adSlot.slotPath, adSlot.sizes, adSlot.id)
                .addService(window.googletag.pubads());

              // Apply size mapping if available
              if (Array.isArray(adSlot.addSize) && adSlot.addSize.length > 0) {
                const mapping = window.googletag.sizeMapping();
                adSlot.addSize.forEach((size: any) => {
                  mapping.addSize(size[0], size[1]);
                });
                slot.defineSizeMapping!(mapping.build());
              }
            });

            // Enable services and refresh
            window.googletag.pubads().enableSingleRequest();
            window.googletag.enableServices();
            window.googletag.pubads().refresh();
          }
        });
      };

      // Reload ads when selectedPath changes
      loadAds();
    }
  }, [selectedPath, RMN_url]);

  return (
    <>
      {RMN_url && <script async src={RMN_url}></script>}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.googletag = window.googletag || {cmd: []};
          `,
        }}
      />
    </>
  );
};

export default RmnScript;
