interface TabNavigationProps {
  dishes: Record<string, { name: string }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ dishes, activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
      {Object.entries(dishes).map(([key, dish]) => (
        <button
          key={key}
          type="button"
          onClick={() => setActiveTab(key)}
          aria-pressed={activeTab === key}
          className={`px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-medium transition-all min-h-[44px] text-sm md:text-base ${activeTab === key
            ? "primary-action text-primary-foreground shadow-sm"
            : "bg-secondary text-foreground hover:bg-accent"
            }`}
        >
          {dish.name}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;