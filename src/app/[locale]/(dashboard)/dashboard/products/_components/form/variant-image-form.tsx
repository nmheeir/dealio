'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CloudUpload, Paperclip } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { FileInput, FileUploader, FileUploaderContent } from '@/components/ui/file-upload';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type VariantImageFormProps = {
  onSubmitAction: (files: File[]) => Promise<void>;
};

export function VariantImageForm({ onSubmitAction }: VariantImageFormProps) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Tạo URL preview cho các file hình ảnh
  useEffect(() => {
    if (files) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);

      // Cleanup: Thu hồi URL khi files thay đổi hoặc component unmount
      return () => {
        newPreviews.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setPreviews([]);
    }
  }, [files]);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4, // 4MB
    multiple: true,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
  };

  const form = useForm({
    resolver: zodResolver(z.object({})), // Không cần schema vì chỉ xử lý file
  });

  const onSubmit = async () => {
    if (!files || files.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 file hình ảnh để upload.');
      return;
    }

    try {
      await onSubmitAction(files);
      // setFiles(null); // Reset files
      // setPreviews([]); // Reset previews
      // toast.success('Upload hình ảnh thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi upload hình ảnh.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-8 py-10 ">
        <FormItem>
          <FormLabel>Chọn hình ảnh</FormLabel>
          <FormControl>
            <FileUploader
              value={files}
              onValueChange={setFiles}
              dropzoneOptions={dropZoneConfig}
              className="relative rounded-lg bg-background p-2"
            >
              <FileInput id="fileInput" className="outline-1 outline-slate-500 outline-dashed">
                <div className="flex w-full flex-col items-center justify-center p-8">
                  <CloudUpload className="h-10 w-10 text-gray-500" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click để upload</span>
                    {' '}
                    hoặc kéo thả
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Chỉ chấp nhận SVG, PNG, JPG, WEBP</p>
                </div>
              </FileInput>
              <FileUploaderContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {files
                  && files.length > 0
                  && files.map((file, i) => (
                    <div
                      key={i}
                      index={i}
                      className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-transform hover:scale-105 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                      {
                        file.type === 'image/svg+xml'
                          ? (
                              <img
                                src={previews[i]}
                                alt={file.name}
                                className="h-24 w-24 rounded-md object-contain"
                              />
                            )
                          : (
                              <Image
                                src={previews[i]}
                                alt={file.name}
                                width={96}
                                height={96}
                                className="h-24 w-24 rounded-md object-cover"
                                unoptimized // Tắt tối ưu hóa cho file local
                              />
                            )
                      }
                      <div className="mt-2 flex items-center space-x-1">
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span
                          className="max-w-[100px] truncate text-xs text-gray-600 dark:text-gray-300"
                          title={file.name} // Hiển thị tên đầy đủ khi hover
                        >
                          {file.name}
                        </span>
                      </div>
                    </div>
                  ))}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button type="submit" className="w-full sm:w-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
}
