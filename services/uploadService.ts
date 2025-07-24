// services/uploadService.ts
import { s3, S3_FOLDERS } from './awsConfig';
import { supabase } from './supabaseClient';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface BookMetadata {
  title: string;
  author: string;
  description?: string;
  genre: string;
  pages: number;
  isbn?: string;
  publishedYear?: number;
  language?: string;
}

export interface UploadProgress {
  stage: 'picking' | 'processing' | 'uploading' | 'ai-processing' | 'complete' | 'error';
  progress: number;
  message: string;
}

export class UploadService {
  private onProgressUpdate?: (progress: UploadProgress) => void;

  constructor(onProgressCallback?: (progress: UploadProgress) => void) {
    this.onProgressUpdate = onProgressCallback;
  }

  private updateProgress(stage: UploadProgress['stage'], progress: number, message: string) {
    this.onProgressUpdate?.({ stage, progress, message });
  }

  // Generate unique book ID
  private generateBookId(): string {
    return `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Pick PDF file from device
  async pickPDFFile(): Promise<DocumentPicker.DocumentPickerResult> {
    this.updateProgress('picking', 0, 'Selecting PDF file...');
    
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      throw new Error('File selection canceled');
    }

    return result;
  }

  // Pick thumbnail/cover image
  async pickThumbnailImage(): Promise<ImagePicker.ImagePickerResult> {
    this.updateProgress('picking', 10, 'Selecting cover image...');
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4], // Book cover aspect ratio
      quality: 0.8,
    });

    return result;
  }

  // Process and resize image
  private async processImage(imageUri: string, width: number = 400): Promise<string> {
    const manipulatedImage = await manipulateAsync(
      imageUri,
      [{ resize: { width } }],
      { compress: 0.8, format: SaveFormat.JPEG }
    );
    return manipulatedImage.uri;
  }

  // Extract PDF metadata (placeholder - would use PDF parsing library)
  private async extractPDFMetadata(pdfUri: string): Promise<Partial<BookMetadata>> {
    this.updateProgress('processing', 20, 'Extracting PDF metadata...');
    
    // In a real implementation, you would use a PDF parsing library like:
    // - react-native-pdf-lib
    // - pdf-parse (for Node.js backend)
    // For now, we'll return placeholder data
    
    return {
      pages: Math.floor(Math.random() * 500) + 50, // Random page count for demo
    };
  }

  // Generate PDF thumbnail (first page)
  private async generatePDFThumbnail(pdfUri: string): Promise<string | null> {
    this.updateProgress('processing', 30, 'Generating PDF thumbnail...');
    
    // In a real implementation, you would use PDF rendering library like:
    // - react-native-pdf-thumbnail
    // - PDF.js for web
    // For now, we'll return null and rely on user-provided thumbnail
    
    return null;
  }

  // Upload file to S3
  private async uploadToS3(
    fileUri: string, 
    key: string, 
    contentType: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const uploadParams = {
      Bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME!,
      Key: key,
      Body: blob,
      ContentType: contentType,
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      s3.upload(uploadParams)
        .on('httpUploadProgress', (progress) => {
          const percentCompleted = Math.round((progress.loaded * 100) / progress.total);
          onProgress?.(percentCompleted);
        })
        .send((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Location);
          }
        });
    });
  }

  // Save book data to Supabase
  private async saveBookToDatabase(
    bookId: string,
    metadata: BookMetadata,
    pdfUrl: string,
    thumbnailUrl?: string,
    userId?: string
  ) {
    this.updateProgress('uploading', 80, 'Saving book information...');

    // Insert book record
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .insert({
        id: bookId,
        title: metadata.title,
        author: metadata.author,
        description: metadata.description,
        genre: metadata.genre,
        pages: metadata.pages,
        isbn: metadata.isbn,
        published_year: metadata.publishedYear,
        language: metadata.language || 'English',
        cover_url: thumbnailUrl,
        rating: 0, // Default rating
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (bookError) throw bookError;

    // Insert book versions (original)
    const { error: versionError } = await supabase
      .from('book_versions')
      .insert({
        book_id: bookId,
        version_type: 'original',
        version_name: 'Original',
        pdf_url: pdfUrl,
        is_ai_processed: false,
        processing_status: 'completed',
      });

    if (versionError) throw versionError;

    // If user is logged in, add to their library
    if (userId) {
      await supabase
        .from('user_books')
        .insert({
          user_id: userId,
          book_id: bookId,
          progress: 0,
          reading_status: 'not_started',
        });
    }

    return bookData;
  }

  // Queue AI processing job
  private async queueAIProcessing(bookId: string, pdfUrl: string) {
    this.updateProgress('ai-processing', 90, 'Queuing AI enhancement...');

    // Insert AI processing job
    const { error } = await supabase
      .from('ai_processing_queue')
      .insert({
        book_id: bookId,
        source_pdf_url: pdfUrl,
        status: 'pending',
        priority: 1,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    // In a real implementation, you would:
    // 1. Send job to AI processing service (AWS Lambda, Google Cloud Functions)
    // 2. The service would process the PDF and create enhanced versions
    // 3. Update the book_versions table with AI-processed versions
  }

  // Main upload function
  async uploadBook(
    pdfFile: DocumentPicker.DocumentPickerAsset,
    metadata: BookMetadata,
    thumbnailUri?: string,
    userId?: string
  ): Promise<string> {
    try {
      const bookId = this.generateBookId();
      
      // Extract PDF metadata
      const pdfMetadata = await this.extractPDFMetadata(pdfFile.uri);
      const completeMetadata = { ...metadata, ...pdfMetadata };

      // Upload PDF to S3
      this.updateProgress('uploading', 40, 'Uploading PDF file...');
      const pdfKey = `${S3_FOLDERS.BOOKS}original/${bookId}/${pdfFile.name}`;
      const pdfUrl = await this.uploadToS3(
        pdfFile.uri,
        pdfKey,
        'application/pdf',
        (progress) => this.updateProgress('uploading', 40 + (progress * 0.3), `Uploading PDF: ${progress}%`)
      );

      // Upload thumbnail if provided
      let thumbnailUrl: string | undefined;
      if (thumbnailUri) {
        this.updateProgress('uploading', 70, 'Uploading cover image...');
        const processedThumbnail = await this.processImage(thumbnailUri);
        const thumbnailKey = `${S3_FOLDERS.COVERS}${bookId}/cover.jpg`;
        thumbnailUrl = await this.uploadToS3(
          processedThumbnail,
          thumbnailKey,
          'image/jpeg',
          (progress) => this.updateProgress('uploading', 70 + (progress * 0.1), `Uploading cover: ${progress}%`)
        );
      } else {
        // Try to generate thumbnail from PDF
        const generatedThumbnail = await this.generatePDFThumbnail(pdfFile.uri);
        if (generatedThumbnail) {
          const thumbnailKey = `${S3_FOLDERS.THUMBNAILS}${bookId}/page-1.jpg`;
          thumbnailUrl = await this.uploadToS3(
            generatedThumbnail,
            thumbnailKey,
            'image/jpeg'
          );
        }
      }

      // Save to database
      await this.saveBookToDatabase(bookId, completeMetadata, pdfUrl, thumbnailUrl, userId);

      // Queue AI processing
      await this.queueAIProcessing(bookId, pdfUrl);

      this.updateProgress('complete', 100, 'Book uploaded successfully!');
      return bookId;

    } catch (error) {
      this.updateProgress('error', 0, `Upload failed: ${error.message}`);
      throw error;
    }
  }

  // Get upload progress for existing uploads
  async getAIProcessingStatus(bookId: string) {
    const { data, error } = await supabase
      .from('ai_processing_queue')
      .select('status, progress, error_message')
      .eq('book_id', bookId)
      .single();

    if (error) throw error;
    return data;
  }
}