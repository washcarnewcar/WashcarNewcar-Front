import { useRouter } from 'next/router';
import LoginCheck from '../../../../src/components/LoginCheck';
import MenuForm from '../../../../src/components/MenuForm';

export default function MenuNew() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <LoginCheck>
      <MenuForm slug={slug as string} data={null} />
    </LoginCheck>
  );
}
