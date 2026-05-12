import { notFound } from "next/navigation";

import { AdminEditor } from "@/components/admin-editor";
import { isAdminPageKey } from "@/lib/admin-pages";
import { getPortfolioConfig } from "@/lib/portfolio";

type AdminSectionPageProps = {
  params: Promise<{
    page: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  const { page } = await params;

  if (!isAdminPageKey(page) || page === "overview") {
    notFound();
  }

  const config = await getPortfolioConfig();

  return <AdminEditor currentPage={page} initialConfig={config} />;
}
