import { BeatLoader } from 'react-spinners';
import { MAIN_COLOR } from '../function/globalVariables';
import styles from '../../styles/Loading.module.scss';

interface LoadingProps {
  fullscreen?: boolean;
}

export default function Loading({ fullscreen }: LoadingProps) {
  if (fullscreen) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <BeatLoader color={MAIN_COLOR} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <BeatLoader color={MAIN_COLOR} />
    </div>
  );
}
