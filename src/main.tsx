import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/index.tsx";
import Leaderboard from "./pages/leaderboard.tsx";
import Profile from "./pages/profile.tsx";
import TokenPage from "./pages/token-by-address.tsx";
import Launch from "./pages/launch.tsx";
import { DefaultLayout } from "./components/layout/index.tsx";

import "react-toastify/dist/ReactToastify.css";
import Challenges from "./pages/challenges.tsx";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/token/:address",
        element: <TokenPage />,
      },
      {
        path: "/launch",
        element: <Launch />,
      },
      {
        path: "/challenges",
        element: <Challenges />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
