import Burgermenu from '../components/Burgermenu';
import Header from '../components/Header';
import CardGrid from '../components/CardGrid';
import { useEffect } from 'react';

const Seller = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://whattime.co.kr/widget/widget.js';
    script.async = true;
    document.head.appendChild(script);
    const style = document.createElement('link');
    style.href = 'https://whattime.co.kr/widget/widget.css';
    style.rel = 'stylesheet';
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      <div
        className="whattime-inline-widget"
        data-code="6emBCKnvqH"
        style={{ minWidth: '320px', height: '660px' }}
      ></div>
    </div>
  );
};

export default Seller;
