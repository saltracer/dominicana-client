
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Book } from '@/lib/types';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  category: z.enum(['Theology', 'Philosophy', 'Spiritual', 'Mysticism', 'Science', 'Natural History']),
  description: z.string().min(1, { message: "Description is required" }),
  coverImage: z.string().optional(),
  epubPath: z.string().optional(),
  epubSamplePath: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBook: Book | null;
  onSave: (data: FormValues, coverFile: File | null, epubFile: File | null, epubSampleFile: File | null) => Promise<void>;
  uploadingCover: boolean;
  uploadingEpub: boolean;
  uploadingEpubSample: boolean;
}

const BookFormDialog: React.FC<BookFormDialogProps> = ({
  open,
  onOpenChange,
  selectedBook,
  onSave,
  uploadingCover,
  uploadingEpub,
  uploadingEpubSample,
}) => {
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [epubSampleFile, setEpubSampleFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: selectedBook?.title || '',
      author: selectedBook?.author || '',
      year: selectedBook?.year || '',
      category: (selectedBook?.category as any) || 'Theology',
      description: selectedBook?.description || '',
      coverImage: selectedBook?.coverImage || '',
      epubPath: selectedBook?.epubPath || '',
      epubSamplePath: selectedBook?.epubSamplePath || '',
    },
  });

  React.useEffect(() => {
    if (selectedBook) {
      form.reset({
        title: selectedBook.title,
        author: selectedBook.author,
        year: selectedBook.year,
        category: selectedBook.category as any,
        description: selectedBook.description,
        coverImage: selectedBook.coverImage || '',
        epubPath: selectedBook.epubPath || '',
        epubSamplePath: selectedBook.epubSamplePath || '',
      });
      setCoverPreview(selectedBook.coverImage || null);
    } else {
      form.reset({
        title: '',
        author: '',
        year: '',
        category: 'Theology',
        description: '',
        coverImage: '',
        epubPath: '',
        epubSamplePath: '',
      });
      setCoverPreview(null);
    }
    setCoverImageFile(null);
    setEpubFile(null);
    setEpubSampleFile(null);
  }, [selectedBook, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'epub' | 'epubSample') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'cover') {
        const file = e.target.files[0];
        setCoverImageFile(file);
        // Create a preview URL for the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (type === 'epub') {
        setEpubFile(e.target.files[0]);
      } else {
        setEpubSampleFile(e.target.files[0]);
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    await onSave(data, coverImageFile, epubFile, epubSampleFile);
    setCoverImageFile(null);
    setEpubFile(null);
    setEpubSampleFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {selectedBook 
              ? 'Update the book details below' 
              : 'Fill in the book details to add it to the library'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Book title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Publication year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Theology">Theology</SelectItem>
                        <SelectItem value="Philosophy">Philosophy</SelectItem>
                        <SelectItem value="Spiritual">Spiritual</SelectItem>
                        <SelectItem value="Mysticism">Mysticism</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Natural History">Natural History</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Book description" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <div className="flex gap-2 items-start">
                        <FormControl className="flex-1">
                          <Input 
                            placeholder="Cover image URL (optional)" 
                            {...field} 
                            value={field.value || ''}
                            disabled={!!coverImageFile}
                          />
                        </FormControl>
                        <div className="relative">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex items-center"
                            disabled={uploadingCover}
                          >
                            <label className="cursor-pointer flex items-center">
                              {uploadingCover ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <ImageIcon className="h-4 w-4 mr-2" />
                              )}
                              Upload Image
                              <Input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'cover')}
                                disabled={uploadingCover}
                              />
                            </label>
                          </Button>
                        </div>
                      </div>
                      {coverImageFile && (
                        <p className="text-sm text-green-600 mt-1">File selected: {coverImageFile.name}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-1">
                      {(coverPreview || field.value) && (
                        <AspectRatio ratio={1.5 / 1} className="bg-dominican-light-gray rounded-md overflow-hidden">
                          <img 
                            src={coverPreview || field.value} 
                            alt="Cover preview" 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </AspectRatio>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="epubPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EPUB Path</FormLabel>
                    <div className="flex gap-2 items-start">
                      <FormControl className="flex-1">
                        <Input placeholder="Path to EPUB file (optional)" {...field} value={field.value || ''} disabled={!!epubFile} />
                      </FormControl>
                      <div className="relative">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex items-center"
                          disabled={uploadingEpub}
                        >
                          <label className="cursor-pointer flex items-center">
                            {uploadingEpub ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            Upload EPUB
                            <Input
                              type="file"
                              className="hidden"
                              accept=".epub"
                              onChange={(e) => handleFileChange(e, 'epub')}
                              disabled={uploadingEpub}
                            />
                          </label>
                        </Button>
                      </div>
                    </div>
                    {epubFile && (
                      <p className="text-sm text-green-600 mt-1">File selected: {epubFile.name}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="epubSamplePath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EPUB Sample Path</FormLabel>
                    <div className="flex gap-2 items-start">
                      <FormControl className="flex-1">
                        <Input placeholder="Path to EPUB sample file (optional)" {...field} value={field.value || ''} disabled={!!epubSampleFile} />
                      </FormControl>
                      <div className="relative">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex items-center"
                          disabled={uploadingEpubSample}
                        >
                          <label className="cursor-pointer flex items-center">
                            {uploadingEpubSample ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            Upload Sample
                            <Input
                              type="file"
                              className="hidden"
                              accept=".epub"
                              onChange={(e) => handleFileChange(e, 'epubSample')}
                              disabled={uploadingEpubSample}
                            />
                          </label>
                        </Button>
                      </div>
                    </div>
                    {epubSampleFile && (
                      <p className="text-sm text-green-600 mt-1">File selected: {epubSampleFile.name}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={uploadingCover || uploadingEpub || uploadingEpubSample}>
                {(uploadingCover || uploadingEpub || uploadingEpubSample) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedBook ? 'Update Book' : 'Add Book'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookFormDialog;
