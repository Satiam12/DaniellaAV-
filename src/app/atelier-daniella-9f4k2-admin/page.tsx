import { AdminEditor } from "@/components/admin-editor";
import { getPortfolioConfig } from "@/lib/portfolio";

export const metadata = {
  title: "Admin | Daniella",
  description: "Edition du portfolio Daniella",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const config = await getPortfolioConfig();

  return <AdminEditor currentPage="overview" initialConfig={config} />;
}
