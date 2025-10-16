import Header from "./headers/Header";
import Contents from "./contents/Contents";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Contents />
    </div>
  );
};

export default Layout;
