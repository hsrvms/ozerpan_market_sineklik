/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { type Product } from "@/documents/products";
import { DynamicPreview } from "@/app/offers/[offerNo]/add-position/steps/components/dynamic-preview";
import { FormikProps } from "formik";

interface ProductPreviewProps {
  product: Product | null;
  formik: FormikProps<any>;
  width?: number;
  height?: number;
  className?: string;
}

export function getProductPreview({
  product,
  formik,
  width = 0,
  height = 0,
  className = "",
}: ProductPreviewProps) {
  if (!product) return null;

  return (
    <DynamicPreview
      product={product}
      productId={product.id}
      formik={formik}
      width={width}
      height={height}
      className={className}
    />
  );
}
