import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GroupSessions from "@/components/GroupSessions";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function GroupSessionsPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    // Set page title
    document.title = `${t("group.title")} | ${t("app.name")}`;
  }, [t]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-blue-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-primary-dark dark:text-primary mb-4">
              {t("group.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("group.description")}
            </p>
          </div>
          
          <GroupSessions />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
