import { useState } from 'react';
import { createContext } from 'react';

interface ProviderProps {
  children: any
}

const IsBurgermenuOpenContext = createContext({
  isOpen: false,
  setIsOpen: (isOpen:boolean) => { },
});

const IsBurgermenuOpenProvider = ({ children } : ProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const value = { isOpen: isOpen, setIsOpen: setIsOpen };
  return (
    <IsBurgermenuOpenContext.Provider value={value}>
      {children}
    </IsBurgermenuOpenContext.Provider>
  );
};

export { IsBurgermenuOpenProvider };
export default IsBurgermenuOpenContext;
