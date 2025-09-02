import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

const fetchAccounts = async () => {
  const { data } = await axios.get('/api/accounts');
  return data;
};

const fetchTransactions = async () => {
    const { data } = await axios.get('/api/transactions');
    return data;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AccountDistributionChart = () => {
  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const chartData = useMemo(() => {
    if (!accounts || !transactions) return [];

    const accountBalances = accounts.map(account => {
        const balance = transactions
            .filter(t => t.accountId === account.id)
            .reduce((sum, t) => sum + t.amount, 0); // Note: this is a simple sum, not a real balance
        return { name: account.name, value: balance };
    });

    return accountBalances.filter(a => a.value > 0);
  }, [accounts, transactions]);

  if (accountsLoading || transactionsLoading) return <div>Loading Chart...</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={(entry) => entry.name}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AccountDistributionChart;
