"use client";

import { useState, useEffect } from "@/utils/hooks/reactUseCustomHooks";

interface AdSlotProps {
  id: string;
  width?: string;
  height?: string;
  slotId?: string;
  Fallback?: any;
}

const AdSlot: React.FC<AdSlotProps> = ({ id, width, height, Fallback }) => {
  const [adLoaded, setAdLoaded] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const googletag = (window as any).googletag || { cmd: [] };

      googletag.cmd.push(() => {
        // Register the slotRenderEnded event listener
        googletag.pubads().addEventListener("slotRenderEnded", (event: any) => {
          if (event.slot.getSlotElementId() === id) {
            adNotDisplayed(event);
          }
        });

        // Display the ad slot
        googletag.display(id);
      });
    }
  }, [id]);

  const adNotDisplayed = (event: any) => {
    console.log(event.slot.getSlotElementId());
    setAdLoaded(!event.isEmpty);
  };

  return (
    <>
      {adLoaded ? (
        <div id={id} style={{ minWidth: width, minHeight: height }}></div>
      ) : (
        Fallback || <></>
      )}
    </>
  );
};

export default AdSlot;
