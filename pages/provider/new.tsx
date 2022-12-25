import LoginCheck from '../../src/components/LoginCheck';
import StoreForm from '../../src/components/StoreForm';

export default function NewStore() {
  return (
    <LoginCheck>
      <StoreForm data={null} />
    </LoginCheck>
  );
}
