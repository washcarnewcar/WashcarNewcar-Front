import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/AuthHeader.module.scss';

export default function AuthHeader() {
  return (
    <Link href="/" className={styles.logo_container}>
      <Image src="/row_logo.png" alt="세차새차" height={54} width={200} className={styles.img_logo} priority />
    </Link>
  );
}
