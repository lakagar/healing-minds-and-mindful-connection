import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MenuIcon, User, LogOut, ShoppingCart, Sun, Moon, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [_, navigate] = useLocation();
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { getTotalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/auth");
  };
  
  const userInitials = user ? 
    (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '') || 
    user.username.substring(0, 2).toUpperCase() : 
    '';
  
  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.services"), href: "/#services" },
    { label: t("nav.moodTracker"), href: "/mood-tracker" },
    { label: t("nav.medicine"), href: "/medicine" },
    { label: t("nav.counseling"), href: "/counseling" },
    { label: t("nav.groupSessions"), href: "/group-sessions" },
  ];
  
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center font-montserrat text-primary dark:text-primary-foreground font-bold text-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {t("app.name")}
              </a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors">
                  {link.label}
                </a>
              </Link>
            ))}
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Globe size={16} />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")}>Español</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={t("theme.toggle")}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            
            {/* Cart Button */}
            {user && (
              <Link href="/medicine#cart">
                <a className="relative p-2">
                  <ShoppingCart size={20} />
                  {getTotalItems() > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </a>
              </Link>
            )}
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full">
                    <Avatar>
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t("nav.profile")}</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("nav.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <a className="ml-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                  {t("nav.login")}
                </a>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {user && (
              <Link href="/medicine#cart">
                <a className="relative p-2 mr-2">
                  <ShoppingCart size={20} />
                  {getTotalItems() > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </a>
              </Link>
            )}
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-left">{t("app.name")}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href}>
                        <a className="block py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          {link.label}
                        </a>
                      </Link>
                    </SheetClose>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  {/* Language Options */}
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("language.select")}:</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant={language === "en" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setLanguage("en")}
                      >
                        EN
                      </Button>
                      <Button 
                        variant={language === "es" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setLanguage("es")}
                      >
                        ES
                      </Button>
                      <Button 
                        variant={language === "fr" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setLanguage("fr")}
                      >
                        FR
                      </Button>
                    </div>
                  </div>
                  
                  {/* Theme Toggle */}
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("theme.toggle")}:</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant={theme === "light" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setTheme("light")}
                      >
                        <Sun size={16} className="mr-2" />
                        Light
                      </Button>
                      <Button 
                        variant={theme === "dark" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setTheme("dark")}
                      >
                        <Moon size={16} className="mr-2" />
                        Dark
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {user ? (
                    <div className="space-y-3">
                      <SheetClose asChild>
                        <Link href="/profile">
                          <a className="flex items-center py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <User className="mr-2 h-5 w-5" />
                            <span>{t("nav.profile")}</span>
                          </a>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full text-left py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          <span>{t("nav.logout")}</span>
                        </button>
                      </SheetClose>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/auth">
                        <a className="block w-full text-center py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                          {t("nav.login")}
                        </a>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
