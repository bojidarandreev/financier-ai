import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTransactions = async () => {
  const { data } = await axios.get('/api/transactions');
  return data;
};

const SpendingBreakdownChart = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  if (isLoading) return <div>Loading Chart...</div>;

  const spendingByCategory = Array.isArray(transactions) ? transactions.reduce((acc, transaction) => {
    const categoryName = transaction.category?.name || 'Uncategorized';
    acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
    return acc;
  }, {}) : {};

  const chartData = Object.keys(spendingByCategory).map(key => ({
    name: key,
    amount: spendingByCategory[key],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SpendingBreakdownChart;
