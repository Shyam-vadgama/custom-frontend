import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, IndianRupee, Calendar, TrendingUp, BarChart3, PieChart, Download, Share2, Volume2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

interface DistrictParams {
  districtCode: string;
}

const DistrictPage: React.FC = () => {
  const { districtCode } = useParams();
  const { t, language } = useLanguage();
  const { fetchDistrictData, isLoading } = useData();
  const [districtData, setDistrictData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (districtCode) {
      loadDistrictData(districtCode, selectedYear);
    }
  }, [districtCode, selectedYear]);

  const loadDistrictData = async (code: string, year: number) => {
    const data = await fetchDistrictData(code, year);
    setDistrictData(data);
  };

  const handleRefresh = async () => {
    if (districtCode) {
      setIsRefreshing(true);
      await loadDistrictData(districtCode, selectedYear);
      setIsRefreshing(false);
    }
  };

  const handleVoiceNarration = () => {
    if (!districtData) return;
    
    const text = language === 'hi' 
      ? `${districtData.district_name} जिले में ${districtData.active_workers} सक्रिय श्रमिक हैं। कुल व्यय ${districtData.total_expenditure} लाख रुपए है।`
      : `${districtData.district_name} district has ${districtData.active_workers} active workers. Total expenditure is ${districtData.total_expenditure} lakhs rupees.`;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const handleDownloadReport = () => {
    if (!districtData) return;

    const reportData = {
      districtCode: districtData.district_code,
      district: districtData.district_name,
      state: districtData.state_name,
      year: selectedYear,
      lastUpdated: districtData.last_updated,
      activeWorkers: districtData.active_workers,
      totalWorkers: districtData.total_workers,
      totalExpenditure: districtData.total_expenditure,
      wageExpenditure: districtData.wage_expenditure,
      materialExpenditure: districtData.material_expenditure,
      totalPersonDays: districtData.total_person_days,
      employmentRate: districtData.employment_provided_percentage,
      completedWorks: districtData.completed_works,
      ongoingWorks: districtData.ongoing_works,
      totalWorks: districtData.total_works,
      activeJobCards: districtData.active_job_cards,
      totalJobCards: districtData.total_job_cards,
      householdsCompleted100Days: districtData.households_completed_100_days,
      averageWageRate: districtData.average_wage_rate,
      timelyPaymentPercentage: districtData.timely_payment_percentage,
      dataSource: districtData.data_source,
      isCached: districtData.is_cached
    };

    // Create CSV content
    const csvContent = [
      ['District Snapshot', ''],
      ['District Code', reportData.districtCode || '—'],
      ['District', reportData.district],
      ['State', reportData.state],
      ['Year', reportData.year],
      ['Last Updated', reportData.lastUpdated ? new Date(reportData.lastUpdated).toLocaleString() : '—'],
      ['Data Source', reportData.dataSource || '—'],
      ['Cached', reportData.isCached ? 'Yes' : 'No'],
      [''],
      ['Employment Metrics', ''],
      ['Active Workers', reportData.activeWorkers],
      ['Total Workers', reportData.totalWorkers],
      ['Total Expenditure (₹ Lakhs)', reportData.totalExpenditure],
      ['Wage Expenditure (₹ Lakhs)', reportData.wageExpenditure],
      ['Material Expenditure (₹ Lakhs)', reportData.materialExpenditure],
      ['Total Person Days', reportData.totalPersonDays],
      ['Average Days per Household', districtData.average_days_per_household],
      ['Employment Rate (%)', reportData.employmentRate],
      ['Timely Payment (%)', reportData.timelyPaymentPercentage],
      [''],
      ['Works & Households', ''],
      ['Completed Works', reportData.completedWorks],
      ['Ongoing Works', reportData.ongoingWorks],
      ['Total Works', reportData.totalWorks],
      ['Active Job Cards', reportData.activeJobCards],
      ['Total Job Cards', reportData.totalJobCards],
      ['Households Completed 100 Days', reportData.householdsCompleted100Days],
      ['Average Wage Rate (₹)', reportData.averageWageRate]
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MGNREGA_${reportData.district}_${reportData.year}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!districtData) return;

    const shareText = language === 'hi'
      ? `${districtData.district_name}, ${districtData.state_name} - मनरेगा डेटा ${selectedYear}\n\nसक्रिय श्रमिक: ${districtData.active_workers?.toLocaleString()}\nकुल व्यय: ₹${districtData.total_expenditure?.toFixed(1)}L\nरोजगार दर: ${districtData.employment_provided_percentage?.toFixed(1)}%`
      : `${districtData.district_name}, ${districtData.state_name} - MGNREGA Data ${selectedYear}\n\nActive Workers: ${districtData.active_workers?.toLocaleString()}\nTotal Expenditure: ₹${districtData.total_expenditure?.toFixed(1)}L\nEmployment Rate: ${districtData.employment_provided_percentage?.toFixed(1)}%`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `MGNREGA Data - ${districtData.district_name}`,
          text: shareText
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert(language === 'hi' ? 'डेटा कॉपी हो गया!' : 'Data copied to clipboard!');
      });
    }
  };

  if (isLoading && !districtData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">{language === 'hi' ? 'डेटा लोड हो रहा है...' : 'Loading district data...'}</p>
        </div>
      </div>
    );
  }

  if (!districtData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'hi' ? 'जिला नहीं मिला' : 'District Not Found'}
          </h1>
          <Link to="/" className="btn-rural-primary">
            {language === 'hi' ? 'होम पर वापस जाएं' : 'Go Back Home'}
          </Link>
        </div>
      </div>
    );
  }

  const years = [2024, 2023, 2022, 2021, 2020];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="btn-icon-large bg-gray-100 hover:bg-gray-200">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {districtData.district_name}
                </h1>
                <p className="text-lg text-gray-600 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {districtData.state_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Year Selector */}
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="input-rural py-2 px-3 text-sm"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              {/* Action Buttons */}
              <button 
                onClick={handleVoiceNarration}
                className="btn-icon-large bg-blue-100 hover:bg-blue-200 text-blue-600"
                title={language === 'hi' ? 'सुनें' : 'Listen'}
              >
                <Volume2 className="w-6 h-6" />
              </button>
              
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-icon-large bg-green-100 hover:bg-green-200 text-green-600 disabled:opacity-50"
                title={language === 'hi' ? 'रीफ्रेश करें' : 'Refresh'}
              >
                <RefreshCw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Workers */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {language === 'hi' ? 'सक्रिय' : 'ACTIVE'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {language === 'hi' ? 'सक्रिय श्रमिक' : 'Active Workers'}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {districtData.active_workers?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'hi' ? `कुल में से ${districtData.total_workers?.toLocaleString()}` : `of ${districtData.total_workers?.toLocaleString()} total`}
              </p>
            </div>
          </div>

          {/* Total Expenditure */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {language === 'hi' ? 'व्यय' : 'SPENT'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {language === 'hi' ? 'कुल व्यय' : 'Total Expenditure'}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{districtData.total_expenditure?.toFixed(1) || '0'} L
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'hi' ? `मजदूरी: ₹${districtData.wage_expenditure?.toFixed(1)}L` : `Wages: ₹${districtData.wage_expenditure?.toFixed(1)}L`}
              </p>
            </div>
          </div>

          {/* Person Days */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                {language === 'hi' ? 'दिन' : 'DAYS'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {language === 'hi' ? 'व्यक्ति दिवस' : 'Person Days'}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {districtData.total_person_days?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'hi' ? `औसत: ${districtData.average_days_per_household?.toFixed(1)} दिन/घर` : `Avg: ${districtData.average_days_per_household?.toFixed(1)} days/HH`}
              </p>
            </div>
          </div>

          {/* Employment Rate */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                {language === 'hi' ? 'दर' : 'RATE'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {language === 'hi' ? 'रोजगार दर' : 'Employment Rate'}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {districtData.employment_provided_percentage?.toFixed(1) || '0'}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'hi' ? `समय पर भुगतान: ${districtData.timely_payment_percentage?.toFixed(1)}%` : `Timely pay: ${districtData.timely_payment_percentage?.toFixed(1)}%`}
              </p>
            </div>
          </div>
        </div>

        {/* Works Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Works Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 text-green-600 mr-2" />
              {language === 'hi' ? 'कार्यों की स्थिति' : 'Works Status'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="font-semibold text-green-800">
                    {language === 'hi' ? 'पूर्ण कार्य' : 'Completed Works'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {districtData.completed_works?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">
                    {((districtData.completed_works / districtData.total_works) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div>
                  <p className="font-semibold text-orange-800">
                    {language === 'hi' ? 'चालू कार्य' : 'Ongoing Works'}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {districtData.ongoing_works?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600">
                    {((districtData.ongoing_works / districtData.total_works) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'hi' ? 'कुल कार्य' : 'Total Works'}
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {districtData.total_works?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Job Cards Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <PieChart className="w-6 h-6 text-blue-600 mr-2" />
              {language === 'hi' ? 'जॉब कार्ड वितरण' : 'Job Cards Distribution'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-semibold text-blue-800">
                    {language === 'hi' ? 'सक्रिय जॉब कार्ड' : 'Active Job Cards'}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {districtData.active_job_cards?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {((districtData.active_job_cards / districtData.total_job_cards) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800">
                    {language === 'hi' ? 'कुल जॉब कार्ड' : 'Total Job Cards'}
                  </p>
                  <p className="text-2xl font-bold text-gray-600">
                    {districtData.total_job_cards?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-xl">
                <p className="font-semibold text-yellow-800 mb-1">
                  {language === 'hi' ? '100 दिन पूरे करने वाले परिवार' : 'Households with 100 Days'}
                </p>
                <p className="text-xl font-bold text-yellow-600">
                  {districtData.households_completed_100_days?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-yellow-700">
                  {language === 'hi' ? `${((districtData.households_completed_100_days / districtData.active_job_cards) * 100).toFixed(1)}% सक्रिय कार्डों का` : `${((districtData.households_completed_100_days / districtData.active_job_cards) * 100).toFixed(1)}% of active cards`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {language === 'hi' ? 'वित्तीय विवरण' : 'Financial Breakdown'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <IndianRupee className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">
                {language === 'hi' ? 'मजदूरी व्यय' : 'Wage Expenditure'}
              </p>
              <p className="text-2xl font-bold text-green-600">
                ₹{districtData.wage_expenditure?.toFixed(1) || '0'}L
              </p>
              <p className="text-sm text-green-700">
                {language === 'hi' ? `कुल का ${((districtData.wage_expenditure / districtData.total_expenditure) * 100).toFixed(0)}%` : `${((districtData.wage_expenditure / districtData.total_expenditure) * 100).toFixed(0)}% of total`}
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">₹</span>
              </div>
              <p className="font-semibold text-gray-900 mb-1">
                {language === 'hi' ? 'सामग्री व्यय' : 'Material Expenditure'}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{districtData.material_expenditure?.toFixed(1) || '0'}L
              </p>
              <p className="text-sm text-blue-700">
                {language === 'hi' ? `कुल का ${((districtData.material_expenditure / districtData.total_expenditure) * 100).toFixed(0)}%` : `${((districtData.material_expenditure / districtData.total_expenditure) * 100).toFixed(0)}% of total`}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-purple-600">₹/day</span>
              </div>
              <p className="font-semibold text-gray-900 mb-1">
                {language === 'hi' ? 'औसत मजदूरी दर' : 'Average Wage Rate'}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{districtData.average_wage_rate?.toFixed(0) || '0'}
              </p>
              <p className="text-sm text-purple-700">
                {language === 'hi' ? 'प्रति दिन' : 'per day'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/compare" className="btn-rural-primary flex items-center justify-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>{language === 'hi' ? 'अन्य जिलों से तुलना करें' : 'Compare with Other Districts'}</span>
          </Link>
          
          <button 
            onClick={handleDownloadReport}
            className="btn-rural-secondary flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>{language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="btn-rural-secondary flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>{language === 'hi' ? 'साझा करें' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistrictPage;
