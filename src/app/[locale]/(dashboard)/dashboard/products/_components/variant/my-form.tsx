'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CloudUpload, Paperclip } from 'lucide-react';
import Papa from 'papaparse';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  csvFile: z.any(),
});

export default function MyForm() {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 1, // chỉ 1 file CSV
    maxSize: 1024 * 1024 * 5,
    multiple: false,
    accept: { 'text/csv': ['.csv'] }, // chỉ nhận file CSV
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!files || files.length === 0) {
        toast.error('Please upload a CSV file.');
        return;
      }

      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          Papa.parse(text, {
            header: true, // đọc thành JSON với header
            skipEmptyLines: true,
            complete: (result) => {
              console.log('CSV Data:', result.data);
              toast.success('CSV file parsed. Check console for data.');
            },
            error: (err) => {
              console.error('Parsing error:', err);
              toast.error('Failed to parse CSV.');
            },
          });
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="csvFile"
          render={() => (
            <FormItem>
              <FormLabel>Upload CSV File</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="relative rounded-lg bg-background p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-1 outline-slate-500 outline-dashed"
                  >
                    <div className="flex w-full flex-col items-center justify-center p-8 ">
                      <CloudUpload className="h-10 w-10 text-gray-500" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Only CSV files are allowed
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files
                      && files.length > 0
                      && files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormDescription>Select a CSV file to upload.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
