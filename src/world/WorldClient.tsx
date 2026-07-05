"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isWebGLAvailable } from "./webgl";
import { Fallback } from "./Fallback";

function BootScreen() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060a0e",
        color: "#35d07f",
        fontFamily: "ui-monospace, Menlo, monospace",
      }}
    >
      <span>▸ INITIALIZING MECH SYSTEMS…</span>
    </main>
  );
}

const World = dynamic(() => import("./World").then((m) => m.World), {
  ssr: false,
  loading: BootScreen,
});

export function WorldClient() {
  const [webgl, setWebgl] = useState<null | boolean>(null);
  useEffect(() => {
    // Intentional: WebGL detection must run after mount (needs a real canvas),
    // so the boot screen shows until the client-side check resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(isWebGLAvailable());
  }, []);

  if (webgl === null) return <BootScreen />;
  if (!webgl) return <Fallback />;
  return <World />;
}
