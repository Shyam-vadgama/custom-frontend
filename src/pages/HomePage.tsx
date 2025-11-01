import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, TrendingUp, Users, IndianRupee, Briefcase, Calendar, Award, Clock, AlertCircle, CheckCircle, BarChart3, PieChart, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';
import { useData } from '../contexts/DataContext';

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const { detectedDistrict, detectLocation, isDetecting } = useLocation();
  const { fetchDistrictData, isLoading } = useData();
  const [districtData, setDistrictData] = useState<any>(null);

  useEffect(() => {
    if (detectedDistrict?.district_code) {
      loadDistrictData(detectedDistrict.district_code);
    }
  }, [detectedDistrict]);

  const loadDistrictData = async (districtCode: string) => {
    const data = await fetchDistrictData(districtCode);
    setDistrictData(data);
  };

  const handleLocationDetection = async () => {
    await detectLocation();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'hi' ? 'हमारी आवाज़, हमारे अधिकार' : 'Our Voice, Our Rights'}
          </h1>
          <p className="text-lg mb-6">
            {language === 'hi' 
              ? 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना'
              : 'Mahatma Gandhi National Rural Employment Guarantee Act'
            }
          </p>
            
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleLocationDetection}
              disabled={isDetecting}
              className="btn-rural-primary flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>
                {language === 'hi' 
                  ? (isDetecting ? 'खोज रहे हैं...' : 'मेरा जिला खोजें')
                  : (isDetecting ? 'Detecting...' : 'Find My District')
                }
              </span>
            </button>
            
            <Link to="/compare" className="btn-rural-secondary flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>{language === 'hi' ? 'जिलों की तुलना' : 'Compare Districts'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Detected District Section */}
      {detectedDistrict && (
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-green-800">
                  {language === 'hi' ? 'स्थान मिल गया' : 'Location Detected'}
                </h2>
              </div>
              <p className="text-base text-green-700">
                <strong>{detectedDistrict.district}</strong>, {detectedDistrict.state}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats Section */}
      {districtData && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-green-600">आपके जिले</span> का डेटा
              </h2>
              <p className="text-lg text-gray-600">Your District's MGNREGA Performance</p>
            </div>
            
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Active Workers */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-blue-600">ACTIVE</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">सक्रिय श्रमिक / Active Workers</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {districtData.active_workers?.toLocaleString() || '0'}
                  </p>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+12% from last month</span>
                  </div>
                </div>
              </div>

              {/* Total Expenditure */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                    <IndianRupee className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="bg-green-50 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-green-600">SPENT</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">कुल व्यय / Total Expenditure</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    ₹{districtData.total_expenditure?.toFixed(1) || '0'} L
                  </p>
                  <div className="flex items-center text-sm">
                    <Activity className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-gray-600">68% wage, 32% material</span>
                  </div>
                </div>
              </div>

              {/* Person Days */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-orange-600" />
                  </div>
                  <div className="bg-orange-50 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-orange-600">DAYS</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">व्यक्ति दिवस / Person Days</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {districtData.total_person_days?.toLocaleString() || '0'}
                  </p>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-gray-600">Avg 45 days/household</span>
                  </div>
                </div>
              </div>

              {/* Completed Works */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="bg-purple-50 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-purple-600">WORKS</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">पूर्ण कार्य / Completed Works</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {districtData.completed_works?.toLocaleString() || '0'}
                  </p>
                  <div className="flex items-center text-sm">
                    <Award className="w-4 h-4 text-purple-500 mr-1" />
                    <span className="text-gray-600">85% completion rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 text-green-600 mr-2" />
                प्रदर्शन संकेतक / Performance Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">78%</span>
                  </div>
                  <p className="font-medium text-gray-900">Employment Provided</p>
                  <p className="text-sm text-gray-600">रोजगार प्रदान</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">92%</span>
                  </div>
                  <p className="font-medium text-gray-900">Timely Payments</p>
                  <p className="text-sm text-gray-600">समय पर भुगतान</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-orange-600">65%</span>
                  </div>
                  <p className="font-medium text-gray-900">Asset Creation</p>
                  <p className="text-sm text-gray-600">संपत्ति निर्माण</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>विस्तृत रिपोर्ट देखें / View Detailed Report</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>जिलों की तुलना / Compare Districts</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MGNREGA Information Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              <span className="text-orange-600">मनरेगा</span> के बारे में जानें
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Mahatma Gandhi National Rural Employment Guarantee Act ensures livelihood security in rural areas by providing guaranteed wage employment
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                स्थान आधारित डेटा
              </h3>
              <h4 className="text-lg font-semibold text-green-600 mb-3">
                Location-Based Data
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Automatically detect your district using GPS and get instant access to local employment data and opportunities
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Activity className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                वास्तविक समय डेटा
              </h3>
              <h4 className="text-lg font-semibold text-blue-600 mb-3">
                Real-Time Updates
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Get the latest employment statistics, wage payments, and work progress directly from official government sources
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                आसान उपयोग
              </h3>
              <h4 className="text-lg font-semibold text-orange-600 mb-3">
                Rural-Friendly Design
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Large buttons, clear icons, voice support, and bilingual interface designed for rural communities
              </p>
            </div>
          </div>

          {/* MGNREGA Guarantees */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              मनरेगा की गारंटी / MGNREGA Guarantees
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">100</span>
                </div>
                <p className="font-semibold text-gray-900">Days of Work</p>
                <p className="text-sm text-gray-600">प्रति परिवार प्रति वर्ष</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">15</span>
                </div>
                <p className="font-semibold text-gray-900">Days to Get Work</p>
                <p className="text-sm text-gray-600">आवेदन के बाद</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">15</span>
                </div>
                <p className="font-semibold text-gray-900">Days for Payment</p>
                <p className="text-sm text-gray-600">कार्य पूरा होने के बाद</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-purple-600">₹220</span>
                </div>
                <p className="font-semibold text-gray-900">Minimum Wage</p>
                <p className="text-sm text-gray-600">प्रति दिन (औसत)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            अपने अधिकारों को जानें
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Know Your Rights • Track Your Work • Ensure Fair Wages
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              शिकायत दर्ज करें / File Complaint
            </button>
            <button className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              हेल्पलाइन / Helpline: 1800-345-2244
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
