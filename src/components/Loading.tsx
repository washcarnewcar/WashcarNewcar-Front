import { BeatLoader } from 'react-spinners';
import { MAIN_COLOR } from '../function/global_variables';
import styles from '../../styles/Loading.module.scss';

function Loading() {
  return (
    <div className={styles.container}>
      <BeatLoader color={MAIN_COLOR} />
    </div>
  );
}

export default Loading;
