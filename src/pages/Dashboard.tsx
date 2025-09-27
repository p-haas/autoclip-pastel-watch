import Header from "@/components/dashboard/Header";
import VideoSection from "@/components/dashboard/VideoSection";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import RecapChart from "@/components/dashboard/RecapChart";
import ClipsTable from "@/components/dashboard/ClipsTable";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <VideoSection />
        <AnalyticsCharts />
        <RecapChart />
        <ClipsTable />
      </main>
    </div>
  );
};

export default Dashboard;