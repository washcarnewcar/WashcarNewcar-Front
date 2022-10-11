import { Link } from 'react-router-dom';
import styles from './MenuItem.module.scss';

interface MenuItemProps {
  slug: string;
  number: string;
}

function MenuItem({ slug, number }: MenuItemProps) {
  return (
    <Link to={`/store/${slug}/menu/${number}`} className={styles.link}>
      <div className={styles.container}>
        <div className={styles.menu_image}>
          <img
            className={styles.menu_image_img}
            src="/style_carcare.jpg"
            alt="menu_image"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.menu_title}>외부 세차</div>
          <div className={styles.menu_detail}>
            세차에 대한 설명
            <br />
            두줄 정도 표시할까 생각중
          </div>
          <div className={styles.menu_price}>80,000원</div>
        </div>
      </div>
    </Link>
  );
}

export default MenuItem;
