import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

export interface Images {
  file: File | null;
  uploaded: boolean;
  previewUrl: string;
}

const credentials = {
  accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEY
    ? process.env.NEXT_PUBLIC_ACCESSKEY
    : '',
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESSKEY
    ? process.env.NEXT_PUBLIC_SECRET_ACCESSKEY
    : '',
};

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_REGION,
  credentials: credentials,
});

const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;

/**
 * 이미지 전송
 */
export const uploadImage = async (
  image: Images,
  directory: string
): Promise<string> => {
  // 파일 없으면 전송하지 않음
  if (!image.file) return image.previewUrl;

  const fileName = `${directory}/${crypto.randomUUID()}${image.file.name}`;
  console.log(fileName);

  const command: PutObjectCommandInput = {
    Bucket: bucket,
    Key: fileName,
    Body: image.file,
    ContentType: image.file.type,
    ACL: 'public-read',
  };

  // 파일 전송 (예외 발생 가능)
  await s3Client.send(new PutObjectCommand(command));

  // 성공
  return fileName;
};

/**
 * 이미지 배열 전송
 */
export const uploadImages = async (
  images: Images[],
  directory: string
): Promise<string[]> => {
  // 파일 없으면 전송하지 않음
  if (images.length === 0) return [];

  const fileNames = [];

  for (let image of images) {
    fileNames.push(await uploadImage(image, directory));
  }

  return fileNames;
};
