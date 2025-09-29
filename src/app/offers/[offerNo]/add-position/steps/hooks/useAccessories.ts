import { PanjurSelections, PriceItem } from "@/types/panjur";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { calculatePanjurAccessories } from "./accessories/panjur";
import { SineklikSelections } from "@/types/sineklik";
import { calculateSineklikAccessories } from "./accessories/sineklik";

interface AccessoryResult {
  accessories: PriceItem[];
}

export function useAccessories(values: PanjurSelections): AccessoryResult {
  const [accessories, setAccessories] = useState<PriceItem[]>([]);
  const searchParams = useSearchParams();
  const sectionCount = searchParams.get("typeId");
  const productId = searchParams.get("productId");
  useEffect(() => {
    const fetchAndCalculateAccessories = async () => {
      try {
        const response = await fetch(`/api/accessories?productId=${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch accessories");
        }
        const data = await response.json();
        const allAccessories: PriceItem[] = data;

        if (allAccessories && productId === "panjur") {
          // Panjur için aksesuar hesaplama
          const result = calculatePanjurAccessories(
            values as PanjurSelections,
            allAccessories,

            sectionCount,
          );
          setAccessories(result);
        } else if (productId === "sineklik") {
          const result = calculateSineklikAccessories(
            values as unknown as SineklikSelections,
            allAccessories,
          );
          setAccessories(result);
        } else if (productId === "pergole") {
          // Gelecekte diğer ürünler için
          // const result = calculatePergoleAccessories(values, allAccessories);
          // setAccessories(result);
          setAccessories([]);
        } else if (productId === "tente") {
          // const result = calculateTenteAccessories(values, allAccessories);
          // setAccessories(result);
          setAccessories([]);
        } else {
          // Bilinmeyen ürün
          setAccessories([]);
        }
      } catch (error) {
        console.error("Error calculating accessories:", error);
        setAccessories([]);
      }
    };

    fetchAndCalculateAccessories();
  }, [values, productId, sectionCount]);

  return { accessories };
}
