import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-primary-dark dark:bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-4">{t("app.name")}</h3>
            <p className="text-blue-100 dark:text-gray-300 mb-4">
              {t("footer.mission")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-200 dark:hover:text-gray-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-200 dark:hover:text-gray-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-200 dark:hover:text-gray-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-200 dark:hover:text-gray-300 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                    {t("nav.home")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/#services">
                  <a className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                    {t("nav.services")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/mood-tracker">
                  <a className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                    {t("nav.moodTracker")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/medicine">
                  <a className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                    {t("nav.medicine")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/counseling">
                  <a className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                    {t("nav.counseling")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/group-sessions">
                  <a className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                    {t("nav.groupSessions")}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">{t("footer.help")}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#faq" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#support" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  Support Center
                </a>
              </li>
              <li>
                <a href="#resources" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  Resource Library
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">{t("footer.emergency")}</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-green-300 dark:text-green-400" />
                <span>{t("footer.crisisLine")}</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-green-300 dark:text-green-400" />
                <a href="mailto:support@healingminds.com" className="text-blue-100 dark:text-gray-300 hover:text-white transition-colors">
                  support@healingminds.com
                </a>
              </li>
              <li className="mt-4">
                <a href="#emergency" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block">
                  {t("footer.resources")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 dark:border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-blue-200 dark:text-gray-400 mb-4 md:mb-0">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center space-x-4">
            <a href="#privacy" className="text-sm text-blue-200 dark:text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#terms" className="text-sm text-blue-200 dark:text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#cookies" className="text-sm text-blue-200 dark:text-gray-400 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
