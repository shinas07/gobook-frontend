// services/awsConfig.ts
import AWS from 'aws-sdk';

// AWS Configuration
export const awsConfig = {
  accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
  bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME || 'gobooks-storage',
};

// Configure AWS
AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});

export const s3 = new AWS.S3();

// S3 Folder Structure
export const S3_FOLDERS = {
  BOOKS: 'books/',
  THUMBNAILS: 'thumbnails/',
  AI_PROCESSED: 'ai-processed/',
  COVERS: 'covers/',
} as const;

// S3 Bucket Structure:
/*
gobooks-storage/
├── books/
│   ├── original/
│   │   └── {book-id}/
│   │       └── {book-title}.pdf
│   └── ai-processed/
│       └── {book-id}/
│           ├── version-1.pdf
│           ├── version-2.pdf
│           └── version-3.pdf
├── thumbnails/
│   └── {book-id}/
│       ├── cover.jpg
│       ├── page-1.jpg
│       ├── page-2.jpg
│       └── ...
└── covers/
    └── {book-id}/
        ├── original.jpg
        └── ai-enhanced.jpg
*/