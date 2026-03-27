import { AdminEditor } from "@/components/admin-editor";
import { getPortfolioConfig } from "@/lib/portfolio";

export const metadata = {
  title: "Admin | satiam",
  description: "Edition du portfolio satiam",
};

export default async function AdminPage() {
  const config = await getPortfolioConfig();

  return <AdminEditor initialConfig={config} />;
}
