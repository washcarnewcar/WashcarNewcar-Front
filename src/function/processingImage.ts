import Compressor from 'compressorjs';

/**
 * 이미지를 5MB 이하의 크기로 압축하는 함수
 */
export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file) reject('파일이 없음');

    new Compressor(file, {
      convertSize: 5000000,
      success(file: File) {
        resolve(file);
      },
      error(error) {
        reject('압축 도중 오류 발생');
      },
    });
  });
};
