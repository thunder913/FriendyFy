import { useRef } from 'react';

const safeDocument = typeof document !== 'undefined' ? document : {};

export default () => {
  const scrollBlocked = useRef();
  const { body } = safeDocument;

  const blockScroll = () => {
     body.style.overflowY = 'hidden';
    scrollBlocked.current = true;
  };

  const allowScroll = () => {
    body.style.overflowY = 'scroll'; 
    scrollBlocked.current = false;
  };

  return [blockScroll, allowScroll];
};