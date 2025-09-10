import type { Product } from '@/api/schemas/product/product.schema';
import {
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  Hash,
  Search,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type ProductInfoCardProps = {
  product: Product;
};

export default function ProductInfoCard({ product }: ProductInfoCardProps) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'inactive': return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'draft': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Card className="w-full">
        {/* Header Section - Product Name và Actions */}
        <CardHeader className="">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <div className="flex gap-2">
                {/* Status Badge */}
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
                {/* Product Type Badge */}
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {product.product_type}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="p-2 transition-colors hover:text-gray-600">
                <Edit className="h-4 w-4" />
              </Button>
              {/* <Button variant="ghost" className="p-2  transition-colors hover:text-gray-600">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="p-2 transition-colors hover:text-gray-600">
                <ExternalLink className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Product ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">Product ID:</span>
              </div>
              <p className="rounded border bg-gray-50 px-3 py-2 font-mono text-sm">
                {product.id}
              </p>
            </div>

            {/* Category
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">Category:</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {product.category.name}
                </Badge>
                <span className="text-sm text-gray-500">
                  (
                  {product.category.slug}
                  )
                </span>
              </div>
            </div>

            {/* Brand */}
            {/* <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">Brand:</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                  {product.brand.name}
                </Badge>
                <span className="text-sm text-gray-500">
                  (
                  {product.brand.slug}
                  )
                </span>
              </div>
            </div> */}
          </div>

          {/* Row 2: Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Description:</span>
            </div>
            <p className="rounded-lg border bg-gray-50 p-4 leading-relaxed text-gray-700">
              {product.description}
            </p>
          </div>

          {/* Row 3: URL & Slug */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Slug */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">URL Slug:</span>
              </div>
              <p className="rounded border bg-gray-50 px-3 py-2 font-mono text-sm text-blue-600">
                /
                {product.slug}
              </p>
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Created At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Created:</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {formatDate(product.createdAt)}
                  </p>
                </div>

                {/* Updated At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Updated:</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: SEO Section */}
          <div className="border-t pt-6">
            <div className="mb-4 flex items-center gap-2 text-gray-700">
              <Search className="h-5 w-5" />
              <h3 className="text-lg font-semibold">SEO Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* SEO Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm font-medium">SEO Title:</span>
                  <Badge variant="outline" className="text-xs">
                    {product.seo_title.length}
                    {' '}
                    chars
                  </Badge>
                </div>
                <p className="rounded border-l-4 border-blue-200 bg-blue-50 p-3 text-sm text-gray-700">
                  {product.seo_title}
                </p>
              </div>

              {/* SEO Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm font-medium">SEO Description:</span>
                  <Badge variant="outline" className="text-xs">
                    {product.seo_description.length}
                    {' '}
                    chars
                  </Badge>
                </div>
                <p className="rounded border-l-4 border-green-200 bg-green-50 p-3 text-sm text-gray-700">
                  {product.seo_description}
                </p>
              </div>
            </div>
          </div>

          {/* Row 5: IDs Reference (Optional fields) */}
          {(product.category_id || product.brand_id) && (
            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium text-gray-500">Reference IDs</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {product.category_id && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Category ID:</span>
                    <code className="rounded bg-gray-100 px-2 py-1">
                      {product.category_id}
                    </code>
                  </div>
                )}
                {product.brand_id && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Brand ID:</span>
                    <code className="rounded bg-gray-100 px-2 py-1">
                      {product.brand_id}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
