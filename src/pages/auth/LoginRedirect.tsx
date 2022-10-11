import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function LoginRedirect() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    localStorage.clear();
    localStorage.setItem('token', token);
    navigate('/');
    return;
  }, [navigate, token]);

  return null;
}

export default LoginRedirect;
