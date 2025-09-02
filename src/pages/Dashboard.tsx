import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SpendingBreakdownChart from '@/components/charts/SpendingBreakdownChart';
import MonthlyTrendsChart from '@/components/charts/MonthlyTrendsChart';
import AccountDistributionChart from '@/components/charts/AccountDistributionChart';

const fetchForecast = async () => {
  const { data } = await axios.get('/api/ai/forecast');
  return data;
};

const fetchAnomalies = async () => {
  const { data } = await axios.get('/api/ai/anomaly');
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
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
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
