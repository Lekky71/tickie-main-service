import sharp from 'sharp';

export enum ImageSize {
  IMAGE_64 = 'IMAGE_64',
  IMAGE_256 = 'IMAGE_256',
  IMAGE_512 = 'IMAGE_512',
}

export const dimensionMap: Map<ImageSize, number> = new Map<ImageSize, number>([
  [ImageSize.IMAGE_256, 256],
  [ImageSize.IMAGE_512, 512],
  [ImageSize.IMAGE_64, 64],
]);

export async function resizeImage(file: Buffer, size: ImageSize): Promise<Buffer> {
  const dimension = dimensionMap.get(size);
  return await
    sharp(file)
      .resize({
        width: dimension,
        height: dimension,
        fit: 'inside',
      })
      .rotate()
      .toBuffer();
}

export interface S3UploadMultipleResponse {
  image128?: string;
  image256?: string;
  image512?: string;
}
