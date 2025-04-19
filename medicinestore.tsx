import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { Medicine } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search, ShoppingCart, Trash2, Plus, Minus, Star, X } from "lucide-react";

// Category badges with colors
const CATEGORY_COLORS: Record<string, string> = {
  "Antidepressant": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Anxiolytic": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Mood Stabilizer": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Sleep Aid": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "Supplement": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
};

export default function MedicineStore() {
  const { t } = useTranslation();
  const { data: medicines = [], isLoading } = useQuery<Medicine[]>({ queryKey: ["/api/medicines"] });
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useCart();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Filter medicines based on search and category
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories from medicines
  const categories = ["all", ...Array.from(new Set(medicines.map(med => med.category)))];
  
  // Format price from cents to dollars
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };
  
  const handleAddToCart = (medicine: Medicine) => {
    addToCart(medicine.id, 1);
  };
  
  const handleQuantityChange = (cartItemId: number, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateQuantity(cartItemId, newQuantity);
  };
  
  const handleViewDetails = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="text-center mb-8">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary-dark dark:text-primary mb-4">{t("medicine.title")}</h2>
        <p className="text-neutral-dark dark:text-gray-300 max-w-2xl mx-auto">{t("medicine.description")}</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          <Input
            type="text"
            placeholder={t("medicine.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-64"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>{t("medicine.cart")}</span>
                {getTotalItems() > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t("medicine.cart")} ({getTotalItems()})
                </SheetTitle>
              </SheetHeader>
              
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80">
                  <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="py-4 flex-1 overflow-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center py-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.medicine.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(item.medicine.price)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="py-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal:</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                  
                  <SheetFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => clearCart()}>
                      Clear Cart
                    </Button>
                    <SheetClose asChild>
                      <Button>Checkout</Button>
                    </SheetClose>
                  </SheetFooter>
                </>
              )}
            </SheetContent>
          </Sheet>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder={t("medicine.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("medicine.allCategories")}</SelectItem>
              {categories.filter(cat => cat !== "all").map((category) => (
                <SelectItem key={category} value={category}>
                  {t(`medicine.${category.toLowerCase().replace(' ', '')}`) || category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredMedicines.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No medicines found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine) => (
            <Card key={medicine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-montserrat font-semibold text-lg text-primary-dark dark:text-primary">{medicine.name}</h3>
                  <Badge className={CATEGORY_COLORS[medicine.category] || "bg-gray-100 text-gray-800"}>
                    {medicine.category}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{medicine.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t("medicine.startingAt")}</span>
                    <p className="font-semibold text-xl">{formatPrice(medicine.price)}</p>
                  </div>
                  <div className="flex items-center">
                    {Array.from({ length: Math.floor(medicine.rating) }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                    ))}
                    {medicine.rating % 1 > 0 && (
                      <Star className="h-4 w-4 text-yellow-400" />
                    )}
                    {Array.from({ length: 5 - Math.ceil(medicine.rating) }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                    ))}
                    <span className="text-xs ml-1">({medicine.ratingCount})</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" onClick={() => handleViewDetails(medicine)} className="px-0">
                        {t("medicine.viewDetails")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{medicine.name}</DialogTitle>
                        <Badge className={CATEGORY_COLORS[medicine.category] || "bg-gray-100 text-gray-800"}>
                          {medicine.category}
                        </Badge>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">{medicine.description}</p>
                        
                        <div className="flex items-center">
                          <div className="mr-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                            <p className="font-semibold text-xl">{formatPrice(medicine.price)}</p>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: Math.floor(medicine.rating) }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                            ))}
                            {medicine.rating % 1 > 0 && (
                              <Star className="h-4 w-4 text-yellow-400" />
                            )}
                            {Array.from({ length: 5 - Math.ceil(medicine.rating) }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                            ))}
                            <span className="text-xs ml-1">({medicine.ratingCount})</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Usage Information</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            This medication should be used as directed by your healthcare provider. 
                            Please consult with your doctor before starting, stopping, or changing 
                            the dosage of any medication.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Side Effects</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            All medications may cause side effects. Consult with your healthcare 
                            provider if you experience any unexpected symptoms.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button onClick={() => handleAddToCart(medicine)}>
                          {t("medicine.addToCart")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button onClick={() => handleAddToCart(medicine)}>
                    {t("medicine.addToCart")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {filteredMedicines.length > 0 && (
        <div className="mt-10 text-center">
          <Button variant="outline">
            {t("medicine.viewAll")}
          </Button>
        </div>
      )}
    </div>
  );
}
