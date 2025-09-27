import { useState } from "react";
import Header from "@/components/dashboard/Header";
import VideoSection from "@/components/dashboard/VideoSection";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import RecapChart from "@/components/dashboard/RecapChart";
import ClipsTable from "@/components/dashboard/ClipsTable";

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(false);

  const resetConnection = () => {
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header onLogoClick={resetConnection} />
      
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <VideoSection isConnected={isConnected} setIsConnected={setIsConnected} />
        <AnalyticsCharts />
        <RecapChart />
        <ClipsTable />
      </main>
    </div>
  );
};

export default Dashboard;