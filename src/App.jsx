import RegisterForm from "./components/forms/RegisterForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./components/Error/Error";
import * as Sentry from "@sentry/react";
import BusinessManagment from "./components/BusinessManagment";
import ConfirmedOrder from "./components/ConfirmedOrder";
import RegisterBusinessForm from "./components/forms/RegisterBusinessForm";
import LandingShop from "./components/LandingShop/LandingShop";
import LandPage from "./components/landpage/LandPage";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login";
import Shops from "./components/Shops/shops";
import Ecommerce from "./components/Ecommerce";
import BusinessPersonalProfile from "./components/BusinessPersonalProfile/BusinessPersonalProfile";
import UserProfile from "./components/UserProfile/UserProfile";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/utils/theme/themeConfig";

function App() {
  const error = "Error 404. Página no encontrada";

  return (
    <div>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<RegisterForm />} />
            <Route path="/register-user" element={<RegisterForm />} />

            <Route path="/confirmed-order" element={<ConfirmedOrder />} />
            <Route
              path="/register-business"
              element={<RegisterBusinessForm />}
            />
            {/*Business*/}
            <Route path="/business-managment" element={<BusinessManagment />} />
            <Route path="/business/:type" element={<Shops />} />
            <Route path="/business/type/:id" element={<LandingShop />} />
            <Route
              path="/business/profile"
              element={<BusinessPersonalProfile />}
            />
            <Route path="/ecommerce" element={<Ecommerce />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Error error={error} />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}
export default Sentry.withProfiler(App);
