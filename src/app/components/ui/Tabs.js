'use client'
import { useState } from 'react';

export const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState('');

  return (
    <div>
      {React.Children.map(children, child => {
        // 將 setActiveTab 函數傳給每個 TabsTrigger
        if (child.type.displayName === 'TabsTrigger') {
          return React.cloneElement(child, { setActiveTab, isActive: child.props.value === activeTab });
        }
        // 只顯示活動的 TabsContent
        if (child.type.displayName === 'TabsContent' && child.props.value === activeTab) {
          return child;
        }
      })}
    </div>
  );
};

export const TabsList = ({ children }) =>
  <div className='flex justify-around'>
    {children}
  </div>;

export const TabsTrigger = ({ children, value, setActiveTab, isActive }) => (
  <button className={isActive ? 'active' : ''} onClick={() => setActiveTab(value)}>
    {children}
  </button>
);
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = ({ children }) => <div>{children}</div>;
TabsContent.displayName = 'TabsContent';
