import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

const fetchTransactions = async () => {
  const { data } = await axios.get('/api/transactions');
  return data;
};

const MonthlyTrendsChart = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const chartData = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filtered = transactions.filter(t => new Date(t.date) > thirtyDaysAgo);

    const spendingByDay = filtered.reduce((acc, transaction) => {
      const day = new Date(transaction.date).toLocaleDateString();
      acc[day] = (acc[day] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.keys(spendingByDay).map(day => ({
      date: day,
      amount: spendingByDay[day],
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);

  if (isLoading) return <div>Loading Chart...</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MonthlyTrendsChart;
