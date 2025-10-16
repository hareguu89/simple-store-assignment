import { Outlet } from "react-router-dom";

const Contents = () => {
  return (
    <main className="flex-1 mt-16">
      <Outlet />
    </main>
  );
};

export default Contents;
