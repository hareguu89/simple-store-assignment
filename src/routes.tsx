import Layout from "@/components/layout/Layout";
import { createBrowserRouter } from "react-router-dom";
import AsyncAtomExample from "./routes/AsyncAtomExample";
import AtomExample from "./routes/AtomExample";
import DerivedAtomExample from "./routes/DerivedAtomExample";
import HomePage from "./routes/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/atom-examples",
        element: <AtomExample />,
      },
      {
        path: "/async-atom-examples",
        element: <AsyncAtomExample />,
      },
      {
        path: "/derived-atom-examples",
        element: <DerivedAtomExample />,
      },
    ],
  },
]);

export default router;
