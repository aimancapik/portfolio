import { useState, useEffect, useRef } from 'react';

export const useDialogue = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);

  const openDialogue = (locationContent) => {
    setContent(locationContent);
    setIsOpen(true);
    setTypedText('');
    setIsTyping(true);
  };

  const closeDialogue = () => {
    setIsOpen(false);
    setTimeout(() => {
      setContent(null);
      setTypedText('');
      setIsTyping(false);
    }, 300); // Wait for exit animation
  };

  const skipTyping = () => {
    if (isTyping && content) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setTypedText(content.dialogue);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (isOpen && content && isTyping) {
      let i = 0;
      setTypedText('');
      
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);

      typingTimerRef.current = setInterval(() => {
        setTypedText(content.dialogue.slice(0, i + 1));
        i++;
        
        // Sound blip could go here (e.g. every other char)
        
        if (i >= content.dialogue.length) {
          clearInterval(typingTimerRef.current);
          setIsTyping(false);
        }
      }, 20); // 20ms per character
    }

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [isOpen, content, isTyping]);

  return {
    isOpen,
    content,
    typedText,
    isTyping,
    openDialogue,
    closeDialogue,
    skipTyping
  };
};
