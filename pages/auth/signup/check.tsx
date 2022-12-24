import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SigninCheck() {
  const router = useRouter();
  const { email } = router.query;

  useEffect(() => {
    // TODO:
  }, [email]);

  return <></>;
}
