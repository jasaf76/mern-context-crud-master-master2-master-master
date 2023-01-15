import React from "react";
import { useRouter } from "next/router";
import AnalyzeChart from "../components/AnalizeScripts/AnalizeScripts";

const AnalyzePage = () => {
  const router = useRouter();
  const { imageUrl } = router.query;

  return (
    <div>
      <h1>Análisis de paquetes</h1>
      <AnalyzeChart imageUrl={imageUrl} />
    </div>
  );
};

export default AnalyzePage;
