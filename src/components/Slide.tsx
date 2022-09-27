import styles from './Slide.module.scss';

function Slide() {
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src="/sample_store_image.png"
        alt="sample"
      />
      <img
        className={styles.image}
        src="/sample_store_image.png"
        alt="sample"
      />
    </div>
  );
}

export default Slide;
