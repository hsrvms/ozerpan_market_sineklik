import {
  PriceItem,
  CalculationResult,
  SelectedProduct,
  PanjurSelections,
} from "@/types/panjur";
import {
  findLamelPrice,
  findSubPartPrice,
  findDikmePrice,
  findBoxPrice,
  findSmartHomePrice,
  findRemotePrice,
  findReceiverPrice,
  findTamburProfiliAccessoryPrice,
  calculateSystemWidth,
  calculateSystemHeight,
  calculateLamelCount,
  calculateLamelGenisligi,
  calculateDikmeHeight,
} from "@/utils/panjur";
import { ProductTab } from "@/documents/products";

export const calculatePanjur = (
  values: PanjurSelections,
  prices: PriceItem[],
  accessories: PriceItem[],
  sectionCount: string,

  availableTabs?: ProductTab[]
): CalculationResult => {
  const errors: string[] = [];

  const systemWidth = calculateSystemWidth(
    values.width,
    values.dikmeOlcuAlmaSekli,
    values.dikmeType
  );

  const systemHeight = calculateSystemHeight(
    values.height,
    values.kutuOlcuAlmaSekli,
    values.boxType
  );

  const dikmeHeight = calculateDikmeHeight(
    systemHeight,
    values.boxType,
    values.dikmeType
  );

  const lamelGenisligi = calculateLamelGenisligi(systemWidth, values.dikmeType);
  const lamelCount = calculateLamelCount(
    systemHeight,
    values.boxType,
    values.lamelTickness
  );
  const dikmeCount = Number(sectionCount) * 2;

  // Price calculations
  const [lamelUnitPrice, lamelSelectedProduct] = findLamelPrice(
    prices,
    values.lamelTickness,
    values.lamelType,
    values.lamel_color,
    lamelCount,
    lamelGenisligi
  );
  const lamelGenisligiMetre = lamelGenisligi / 1000;
  const lamelPrice = lamelUnitPrice * lamelGenisligiMetre * lamelCount;

  const [subPartPrice, subPartSelectedProduct] = findSubPartPrice(
    prices,
    values.subPart,
    values.subPart_color || values.lamel_color,
    lamelGenisligi
  );

  const [dikmeUnitPrice, dikmeSelectedProduct] = findDikmePrice(
    prices,
    values.dikmeType,
    values.dikme_color || values.lamel_color,
    dikmeCount,
    dikmeHeight
  );
  const dikmePrice = dikmeUnitPrice * dikmeCount;

  const { frontPrice, backPrice, selectedFrontBox, selectedBackBox } =
    findBoxPrice(prices, values.boxType, values.box_color, systemWidth);
  const boxPrice = frontPrice + backPrice;

  // Uzaktan kumanda fiyatı hesaplama
  const [remotePrice, remoteSelectedProduct] = findRemotePrice(
    prices,
    values.remote
  );

  // Akıllı ev sistemi fiyatlandırması
  const [smarthomePrice, smarthomeSelectedProduct] = findSmartHomePrice(
    prices,
    values.smarthome
  );

  // Get the movement tab
  const movementTab = availableTabs?.find((tab) => tab.id === "movement");

  // Calculate receiver price
  const [receiverPrice, receiverSelectedProduct] = findReceiverPrice(
    prices,
    values.receiver,
    movementTab
  );

  // Tambur Profili fiyatı hesaplama
  const [tamburPrice, tamburSelectedProduct] = findTamburProfiliAccessoryPrice(
    prices,
    values.movementType,
    values.width
  );

  // Aksesuarların fiyatını hesapla
  const accessoriesPrice = (accessories || []).reduce((total, acc) => {
    return total + parseFloat(acc.price) * (acc.quantity || 1);
  }, 0);

  const rawTotalPriceEUR =
    lamelPrice +
    subPartPrice +
    dikmePrice +
    boxPrice +
    tamburPrice +
    remotePrice +
    smarthomePrice +
    receiverPrice +
    accessoriesPrice;

  const totalPrice = rawTotalPriceEUR;

  // Aksesuarları SelectedProduct formatına dönüştür ve tüm ürünleri birleştir
  const productItems = [
    lamelSelectedProduct,
    subPartSelectedProduct,
    dikmeSelectedProduct,
    selectedFrontBox,
    selectedBackBox,
    tamburSelectedProduct,
    remoteSelectedProduct,
    smarthomeSelectedProduct,
    receiverSelectedProduct,
  ].filter(
    (product): product is SelectedProduct =>
      product !== null && product !== undefined
  );

  const selectedProducts = {
    products: productItems,
    accessories: accessories || [],
  };

  return {
    totalPrice,
    selectedProducts,
    errors,
  };
};
