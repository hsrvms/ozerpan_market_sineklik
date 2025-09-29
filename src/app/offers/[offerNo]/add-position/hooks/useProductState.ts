import { PanjurSelections } from "@/types/panjur";

// Product-specific tip döndüren yardımcı fonksiyon
export function getProductSpecificType(productId: string | null) {
  switch (productId) {
    case "panjur":
      return {} as PanjurSelections & Record<string, string | number | boolean>;
    case "sineklik":
      // Gelecekte: return {} as SineklikSelections ;
      return {} as PanjurSelections & Record<string, string | number | boolean>;
    default:
      return {} as PanjurSelections & Record<string, string | number | boolean>;
  }
}
