import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <HelmetProvider>
          <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </QueryClientProvider>
      </HelmetProvider>
  </StrictMode>,
)
