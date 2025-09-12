/* eslint-disable no-console */
'use client';

import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';

import {
  zodResolver,
} from '@hookform/resolvers/zod';
import {
  CloudUpload,
  Paperclip,
} from 'lucide-react';

import Papa from 'papaparse';
import {
  useState,
} from 'react';
import {
  useForm,
} from 'react-hook-form';
import {
  toast,
} from 'sonner';
import {
  z,
} from 'zod';
import { useAddDigitalKey } from '@/api/product-variant/use-add-digital-key';
import {
  Button,
} from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function VariantActionCsvContent({ item }: { item: ProductVariant }) {
  return (
    <Dialog>
      <DialogTrigger>
        Add Stock
      </DialogTrigger>
      <DialogContent className="lg:min-w-4xl">
        <UploadCsvForm item={item} />
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  csvFile: z.any(),
});

function UploadCsvForm({ item }: { item: ProductVariant }) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const { mutateAsync } = useAddDigitalKey();

  const dropZoneConfig = {
    maxFiles: 1, // chỉ 1 file CSV
    maxSize: 1024 * 1024 * 5,
    multiple: false,
    accept: { 'text/csv': ['.csv'] }, // chỉ nhận file CSV
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function parseCsv(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
          complete: (result) => {
            console.log('CSV Data:', result.data);
            setCsvData(result.data as any[]);
            toast.success('CSV parsed successfully.');
          },
          error: (err) => {
            console.error('Parsing error:', err);
            toast.error('Failed to parse CSV.');
          },
        });
      }
    };
    reader.readAsText(file);
  }

  function handleFileUpload(fileList: File[] | null) {
    console.log('📂 handleFileUpload called. File list:', fileList);

    setFiles(fileList);

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log('✅ File selected:');
      console.log('   • Name:', file.name);
      console.log('   • Type:', file.type); // mimetype (text/csv, application/vnd.ms-excel, …)
      console.log('   • Size:', file.size, 'bytes');
      console.log('   • Last modified:', new Date(file.lastModified).toLocaleString());
      parseCsv(file);
    } else {
      console.warn('⚠️ No file selected, resetting csvData.');
      setCsvData(null);
    }
  }

  function handleRemoveFile() {
    setFiles(null);
    setCsvData(null);
    form.reset();
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!files || !csvData) {
        toast.error('Please upload a CSV file first.');
        return;
      }
      mutateAsync(
        { id: item.id, file: files![0]! },
        {
          onSuccess: (res) => {
            console.log('Upload success:', res);
            toast.success('CSV uploaded successfully!');
          },
          onError: (err: any) => {
            console.error('Upload error:', err);
            toast.error('Upload failed!');
          },
        },
      );
      handleRemoveFile();
    } catch (err) {
      console.log('On submit failed: ', err, values);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        {!csvData
          ? (
              <FormField
                control={form.control}
                name="csvFile"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload CSV File</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={files}
                        onValueChange={handleFileUpload}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Digital Key for
                    {' '}
                    {item.variant_name}
                  </h3>
                  <Button variant="destructive" onClick={handleRemoveFile}>
                    Remove File
                  </Button>
                </div>
                <div className="max-h-[500px] overflow-auto rounded-md border">
                  <table className="w-full table-fixed text-sm">
                    <tbody>
                      {csvData.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="truncate border px-2 py-1">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
        <Button
          type="submit"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
