import { useParams } from 'react-router-dom';

const Menu = () => {
  const { code } = useParams();

  /**
   * 코드를 가지고 캘린더(메뉴)를 가져온다.
   * 캘린더를 가져올 때 꼭 사용자의 캘린더인지 확인할 것
   */

  return <div>코드는 {code}</div>;
};

export default Menu;
