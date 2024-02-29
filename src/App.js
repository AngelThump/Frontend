import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import { CssBaseline, styled } from "@mui/material";
import Loading from "./utils/Loading";
import client from "./auth/feathers";

//const Frontpage = lazy(() => import("./frontpage"));
const NavBar = lazy(() => import("./navbar/navbar"));
const NotFound = lazy(() => import("./utils/NotFound"));
//const Recovery = lazy(() => import("./recovery"));
const Auth = lazy(() => import("./auth"));
//const Dashboard = lazy(() => import("./dashboard"));
//const Pages = lazy(() => import("./pages"));
//const ChannelPage = lazy(() => import("./channel-page"));
//const Settings = lazy(() => import("./settings"));
//const Help = lazy(() => import("./help"));

export default function App() {
  const [displayAds, setDisplayAds] = useState(true);
  const [user, setUser] = useState(undefined);

  let darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0e0e10",
      },
      primary: {
        main: "#03a9f4",
      },
      secondary: {
        main: "#7986cb",
      },
      alt: {
        main: "#efeff1",
      },
    },
    typography: {
      alt: {
        color: "#868686",
        fontSize: 16,
        fontWeight: 500,
      },
      userNavText: {
        color: "#efeff1",
        fontSize: 16,
        fontWeight: 500,
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            color: "white",
            backgroundImage: "none",
          },
        },
      },
    },
  });

  darkTheme = responsiveFontSizes(darkTheme);

  useEffect(() => {
    client.authenticate().catch(() => setUser(null));

    client.on("authenticated", (paramUser) => {
      setUser(paramUser.user);
      if (paramUser.user.type === "admin" || paramUser.user.angel) {
        setDisplayAds(false);
      } else if (paramUser.user.patreon && paramUser.user.patreon.isPatron) {
        setDisplayAds(false);
      }
    });

    client.on("logout", () => {
      setUser(null);
      window.location.href = "/";
    });

    return;
  }, [user]);

  if (user === undefined)
    return (
      <Parent>
        <Loading />
      </Parent>
    );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Parent>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="*"
                element={
                  <>
                    <NavBar user={user} />
                    <NotFound />
                  </>
                }
              />
              <Route
                exact
                path="/login"
                element={
                  <>
                    <NavBar user={user} />
                    <Auth user={user} login={true} />
                  </>
                }
              />
              <Route
                exact
                path="/register"
                element={
                  <>
                    <NavBar user={user} />
                    <Auth user={user} register={true} />
                  </>
                }
              />
            </Routes>
          </Suspense>
        </Parent>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const Parent = styled((props) => <div {...props} />)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

/**
 * <Route
                exact
                path="/"
                element={
                  <>
                    <NavBar user={user} />
                    <Frontpage user={user} displayAds={displayAds} />
                  </>
                }
              />
 * <Route
                exact
                path="/login"
                element={
                  <>
                    <NavBar user={user} />
                    <Auth user={user} />
                  </>
                }
              />
              <Route
                exact
                path="/(register|signup)"
                element={
                  <>
                    <NavBar user={user} />
                    <Auth user={user} />
                  </>
                }
              />
              <Route exact path="/user/recovery" element={<Recovery />} />
              <Route
                exact
                path="/dashboard"
                element={
                  <>
                    <NavBar user={user} />
                    <Dashboard user={user} />
                  </>
                }
              />
              <Route exact path="/settings" element={<Redirect to="/settings/profile" />} />
              <Route
                exact
                path="/settings/:subPath"
                element={
                  <>
                    <NavBar user={user} />
                    <Settings user={user} />
                  </>
                }
              />
              <Route exact path="/help" element={<Redirect to="/help/stream" />} />
              <Route exact path="/help/:subPath" element={<Help />} />
              <Route exact path="/p/:pages" element={<Pages />} />
              <Route
                exact
                path="/:channel"
                element={
                  <>
                    <NavBar user={user} />
                    <ChannelPage user={user} displayAds={displayAds} />
                  </>
                }
              />
              <Route exact path="/:channel/embed" element={<Redirect embed={true} />} />
 */
