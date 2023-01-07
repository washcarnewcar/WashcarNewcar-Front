import Image from 'next/image';

interface TempImageProps {
  width: number;
  height: number;
  className?: string;
}

export default function TempImage({ width, height }: TempImageProps) {
  return (
    <Image
      src="/main_logo.png"
      width={width}
      height={height}
      alt=""
      style={{ opacity: '50%' }}
    />
  );
}
