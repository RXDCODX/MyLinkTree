import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { MainContainer } from "./components/container.tsx";

// Разметка уже в HTML до сборки (scripts/prerender.mjs), поэтому нужен
// hydrateRoot, а не createRoot: он подхватит её и не будет перерисовывать.
hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <MainContainer />
  </StrictMode>,
);
