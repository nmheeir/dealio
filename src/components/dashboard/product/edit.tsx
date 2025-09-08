'use client';

import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProductMedia from './edit/product-media';

type ProductFormProps = {
  onSubmit?: (data: ProductVariant) => void;
  data: ProductVariant;
};

export default function ProductForm({ onSubmit, data }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductVariant>({
    ...data,
  });

  const handleInputChange = (field: keyof ProductVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* General Information */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-sm font-medium text-gray-700">
                  Product Name
                </Label>
                <Input
                  id="productName"
                  value={formData.variant_name}
                  onChange={e => handleInputChange('variant_name', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.product.description}
                  onChange={e => handleInputChange('product.description', e.target.value)}
                  className="h-24 w-full resize-none"
                />
              </div>
            </CardContent>
          </Card>
          {/* Product Media */}
          <ProductMedia images={formData.images} />
          {/* Inventory */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900">Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium text-gray-700">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={e => handleInputChange('sku', e.target.value)}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="barcode" className="text-sm font-medium text-gray-700">
                    Barcode
                  </Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={e => handleInputChange('barcode', e.target.value)}
                  />
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.stock?.quantity}
                    onChange={e => handleInputChange('stock', { ...formData.stock, quantity: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basePricing" className="text-sm font-medium text-gray-700">
                  Base Pricing
                </Label>
                <Input
                  id="basePricing"
                  value={formData.price}
                  onChange={e => handleInputChange('price', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage" className="text-sm font-medium text-gray-700">
                    Discount Percentage (%)
                  </Label>
                  <Input
                    id="discountPercentage"
                    value={formData.discount}
                    onChange={e => handleInputChange('discount', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    &nbsp;
                  </Label>
                  {/* <Select value={formData.discountType} onValueChange={value => handleInputChange('discountType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="buy-one-get-one">Buy One Get One</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900">Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productCategory" className="text-sm font-medium text-gray-700">
                  Product Category
                </Label>
                {/* <Select value={formData.productCategory} onValueChange={value => handleInputChange('productCategory', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Product Tags
                </Label>
                {/* <Select value={formData.productTags[0]} onValueChange={value => handleInputChange('productTags', [value])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internet Of Things">Internet Of Things</SelectItem>
                    <SelectItem value="Smart Device">Smart Device</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Latest">Latest</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
