import { ReactElement, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { checkLogin } from '../functions/request';

interface LoginCheckProps {
  // 로그인 체크를 수행하고 성공하면 넘어갈 링크 주소
  next: ReactElement;
}

/**
 * 로그인 체크를 수행하고 로그인이 되지 않았다면 로그인 링크로,
 * 되었다면 props로 전달된 요소를 반환한다.
 */
const LoginCheck = ({ next }: LoginCheckProps) => {
  const [isLogind, setIsLogind] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    runAsync();
  }, []);

  const runAsync = async () => {
    setIsLogind(await checkLogin());
    setReady(true);
  };

  if (!ready) {
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <Loading />
      </div>
    );
  }

  if (!isLogind) {
    return <Navigate to="/login" replace />;
  } else {
    return next;
  }
};

export default LoginCheck;
