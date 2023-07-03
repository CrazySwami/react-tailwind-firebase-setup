import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import ForgotPassword from "../Auth/ForgotPassword";
import MobileNumberLogin from "../Auth/MobileNumberLogin";
import DefaultLayout from "../Layout/DefaultLayout";
import Dashboard from "../Component/Pages/Dashboard/Dashboard";
import NotFound from "../Component/Pages/NotFound/NotFound";
import Adsense from "../Component/Pages/Adsense/Adsense";
import Amazon from "../Component/Pages/Amazon/Amazon";
import BookMyShow from "../Component/Pages/BookMyShow/BookMyShow";
import BlogOrderPage from '../Component/Pages/BlogReview/BlogOrderPage';
import OrderDetails from "../Component/Pages/Admin/OrderDetails";
import AdminView from "../Component/Pages/Admin/AdminView";
import UserBlogOrders from '../Component/Layout/Tables/Users-Listing-Admin-Only';



const routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
  },
  {
    path: "/",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "phone-login",
        element: <MobileNumberLogin />,
      },
    ],
  },
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "adsense",
        element: <Adsense />,
      },
      {
        path: "adminView",
        element: <AdminView />,
      },
      {
        path: "bookmyshow",
        element: <BookMyShow />,
      },

      {
        path: "blogOrder/:id",
        element: <BlogOrderPage />,
      },

      {
        path: "/admin/users/:userId/blog-orders",
        element: <UserBlogOrders />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
export default routes;
