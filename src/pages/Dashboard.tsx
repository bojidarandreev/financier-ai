import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SpendingBreakdownChart from '@/components/charts/SpendingBreakdownChart';
import MonthlyTrendsChart from '@/components/charts/MonthlyTrendsChart';
import AccountDistributionChart from '@/components/charts/AccountDistributionChart';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const fetchForecast = async () => {
  const { data } = await axios.get('/api/ai/forecast');
  return data;
};

const fetchAnomalies = async () => {
  const { data } = await axios.get('/api/ai/anomaly');
  return data;
};

const fetchAdvice = async () => {
    const { data } = await axios.get('/api/ai/advisor');
    return data;
};

const DashboardPage = () => {
  const { data: forecastData, isLoading: forecastLoading } = useQuery({
    queryKey: ['forecast'],
    queryFn: fetchForecast,
  });

  const { data: anomalyData, isLoading: anomalyLoading } = useQuery({
    queryKey: ['anomalies'],
    queryFn: fetchAnomalies,
  });
  
  const { mutate: getAdvice, data: adviceData, isPending: adviceLoading } = useMutation({
    mutationFn: fetchAdvice,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {/* Main column */}
        <motion.div className="lg:col-span-2 space-y-6" variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingBreakdownChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyTrendsChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* Right sidebar */}
        <motion.div className="space-y-6" variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>AI Budget Advisor</CardTitle>
            </CardHeader>
            <CardContent>
              {adviceLoading && <p>Thinking...</p>}
              {adviceData && <p>{adviceData.advice}</p>}
              {!adviceData && !adviceLoading && <p>Click the button to get personalized financial advice.</p>}
              <Button onClick={() => getAdvice()} disabled={adviceLoading} className="mt-4">
                Get Advice
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {forecastLoading ? <p>Generating forecast...</p> : <p>{forecastData?.forecast}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Spending Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              {anomalyLoading ? <p>Analyzing spending...</p> : <p>{anomalyData?.message}</p>}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Account Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDistributionChart />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
