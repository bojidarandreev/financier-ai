import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import TransactionsPage from './pages/Transactions';
import AccountsPage from './pages/Accounts';
import CategoriesPage from './pages/Categories';
import Layout from './components/Layout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/transactions" element={<Layout><TransactionsPage /></Layout>} />
          <Route path="/accounts" element={<Layout><AccountsPage /></Layout>} />
          <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
