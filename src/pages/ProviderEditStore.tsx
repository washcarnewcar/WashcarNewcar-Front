import Header from '../components/Header';

const ProviderEditStore = () => {
  return (
    <>
      {/* <Header type={2} /> */}
      <div>운영하시는 매장의 정보를 입력해주세요</div>
      <div>매장이름</div>
      <input type="text" />
      <div>홈페이지 주소</div>
      <div>
        http://washcarnewcar.duckdns.org/provider/
        <input type="text" />
      </div>
      <div>매장위치</div>
      <button>카카오맵 검색</button>
      <div>찾아는 길(선택)</div>
      <input type="text" />
      <div>매장 설명(선택)</div>
      <input type="text" />
      <div>프로필사진(선택)</div>
      <button>사진 업로드</button>
      <div>매장사진(선택)</div>
      <button>사진 업로드</button>
      <button>저장</button>
    </>
  );
};

export default ProviderEditStore;
