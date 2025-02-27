// import { useContext, useEffect, useRef } from "react";
// import PlacedBlock from "../types/PlacedBlock";
// import { AppContext } from "./AppContextProvider";
// import CorruptionHandler from "../lib/CorruptionHandler";

// export function CorruptionHandlerRenderer({ allBlocks, corruptedBlocks }: { allBlocks: PlacedBlock[], corruptedBlocks: PlacedBlock[] }) {
//   const { enemyHandler } = useContext(AppContext);

//   const corruptionHandler = useRef<CorruptionHandler | null>(new CorruptionHandler(corruptedBlocks, allBlocks, enemyHandler!));

//   useEffect(() => {

//     corruptionHandler.current?.start();

//     return () => corruptionHandler.current?.stop();
//   }, []);

//   return null;
// }
