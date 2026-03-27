import { PortfolioView } from "@/components/portfolio-view";
import { getPortfolioConfig } from "@/lib/portfolio";

export default async function Home() {
  const config = await getPortfolioConfig();

  return <PortfolioView config={config} />;
}
