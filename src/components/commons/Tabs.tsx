import { createContext, useContext, ReactNode } from "react";

interface TabsContextType {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
}

const Tabs = ({ activeTab, onTabChange, children }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ activeTab, onTabChange }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
}

const TabList = ({ children }: TabListProps) => {
  return <div className="flex border-b border-gray-200">{children}</div>;
};

interface TabProps {
  id: string;
  children: ReactNode;
}

const Tab = ({ id, children }: TabProps) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab must be used within Tabs");
  }

  const { activeTab, onTabChange } = context;
  const isActive = activeTab === id;

  return (
    <button
      className={`px-4 py-2 ${
        isActive
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => onTabChange(id)}
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  id: string;
  children: ReactNode;
}

const TabPanel = ({ id, children }: TabPanelProps) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabPanel must be used within Tabs");
  }

  if (context.activeTab !== id) {
    return null;
  }

  return <div className="p-4">{children}</div>;
};

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export default Tabs;
