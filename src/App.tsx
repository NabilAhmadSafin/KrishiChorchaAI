import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";

// Placeholder pages
const Home = React.lazy(() => import('./pages/Home'));
const DiagnosisWizard = React.lazy(() => import('./pages/DiagnosisWizard'));
const Results = React.lazy(() => import('./pages/Results'));
const Library = React.lazy(() => import('./pages/Library'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <React.Suspense fallback={<div className="p-8 text-center text-stone-500">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/diagnosis" element={<DiagnosisWizard />} />
                <Route path="/results" element={<Results />} />
                <Route path="/library" element={<Library />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </React.Suspense>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
