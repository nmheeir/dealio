/* eslint-disable react/no-array-index-key */
import type { ProductImage } from '@/api/schemas/product/product-image.schema';
import { RotateCcw, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProductMediaProps = {
  // onSubmit?: (data: ProductData) => void;
  images?: ProductImage[];
};

export default function ProductMedia({ images }: ProductMediaProps) {
  const [loading, setLoading] = useState(false);

  const handleImageRemove = (index: number) => {
    // setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    // onSubmit?.(formData);
  };
  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle className="text-lg font-medium text-gray-900">
          Product Media
        </CardTitle>
        <Button variant="outline">Upload image</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-4">

            {/* Image Previews */}
            <div className="col-span-2">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
                {images?.map((src, index) => (
                  <div key={index} className="group relative h-32 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    <Image src={src.product_url} alt={`Product ${index + 1}`} fill className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center space-x-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 px-3 text-xs"
                        onClick={() => handleImageRemove(index)}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

function ActionButton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center space-x-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
      <Button
        size="sm"
        variant="secondary"
        className="h-8 px-3 text-xs"
        onClick={() => {}}
      >
        <RotateCcw className="mr-1 h-3 w-3" />
        Replace
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="h-8 px-3 text-xs"
        onClick={() => {}}
      >
        <X className="mr-1 h-3 w-3" />
        Remove
      </Button>
    </div>
  );
}
