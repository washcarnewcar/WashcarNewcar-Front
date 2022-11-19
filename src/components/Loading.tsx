import { BeatLoader } from 'react-spinners';
import { MAIN_COLOR } from '../function/globalVariables';
import styles from '../../styles/Loading.module.scss';

function Loading() {
  return (
    <div className={styles.container}>
      <BeatLoader color={MAIN_COLOR} />
    </div>
  );
}

export default Loading;
