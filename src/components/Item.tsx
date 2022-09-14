import styles from './Item.module.scss';

const Item = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img
          src="style_carcare.jpg"
          alt="스타일카케어"
          className={styles.image}
        />
        <div className={styles.text}>
          <div className={styles.name}>스타일카케어</div>
          <div className={styles.subtext}>
            <div className={styles.distance}>0.3km</div>
            <div className={styles.ratings}>
              ⭐️<span className={styles.number}>4.7</span>(200+)
            </div>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.inner1}>
          <Tag text="기본세차 38,500원" />
          <Tag text="스페셜세차 66,000원" />
          <Tag text="프리미엄세차 126,000원" />
        </div>
        <div className={styles.inner2}>
          <Tag text="10:00" />
          <Tag text="10:30" />
          <Tag text="11:00" />
          <Tag text="12:00" />
          <Tag text="12:30" />
        </div>
      </div>
    </div>
  );
};

interface ITag {
  text: string;
}

const Tag = ({ text }: ITag) => {
  return <div className={styles.tag_container}>{text}</div>;
};

export default Item;
