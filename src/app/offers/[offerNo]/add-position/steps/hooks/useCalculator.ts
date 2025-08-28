import { useState, useEffect } from "react";
import { PriceItem, CalculationResult, PanjurSelections } from "@/types/panjur";
import { SineklikSelections } from "@/types/sineklik";
import { useAccessories } from "./useAccessories";
import { ProductTab } from "@/documents/products";
import { calculatePanjur } from "./calculations/panjur";
import { calculateSineklik } from "./calculations/sineklik";
import { useSearchParams } from "next/navigation";

// Generic calculator hook
export const useCalculator = (
  values: PanjurSelections,
  productName: string,
  availableTabs?: ProductTab[],
) => {
  const [result, setResult] = useState<CalculationResult>({
    totalPrice: 0,
    selectedProducts: { products: [], accessories: [] },
    errors: [],
  });
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const { accessories } = useAccessories(values);

  const searchParams = useSearchParams();

  const sectionCount = searchParams.get("typeId");

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          `/api/product-prices?productId=${productName.toLowerCase()}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch prices");
        }
        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, [productName]);

  useEffect(() => {
    if (!prices.length || !values) return;

    if (productName === "panjur") {
      // Panjur için hesaplama
      const result = calculatePanjur(
        values as PanjurSelections,
        prices,
        accessories || [],
        sectionCount || "1", // Default to "1" if typeId is not set
        availableTabs,
      );
      setResult(result);
    } else if (productName === "sineklik") {
      const result = calculateSineklik(
        values as unknown as SineklikSelections,
        prices,
        accessories || [],
      );
      setResult(result);
    } else {
      // Diğer ürünler için henüz implement edilmedi
      setResult({
        totalPrice: 0,
        selectedProducts: { products: [], accessories: [] },
        errors: [
          `${productName} ürünü için hesaplama henüz implement edilmedi`,
        ],
      });
    }
  }, [prices, values, productName, accessories, availableTabs, sectionCount]);

  return result;
};
