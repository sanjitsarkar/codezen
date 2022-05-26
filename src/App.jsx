import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { Layout, ProtectedRoute } from "./components";
import { CodeEditorPage, LandingPage } from "./pages";
import { Toaster } from "react-hot-toast";
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<ProtectedRoute />}>
          <Route element={<CodeEditorPage />} path="/codes/:id" />
        </Route>
      </Routes>
      <Toaster />
    </Layout>
  );
}
