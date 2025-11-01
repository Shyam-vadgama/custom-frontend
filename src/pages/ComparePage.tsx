import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, BarChart3, TrendingUp, Users, IndianRupee, Calendar, Award, Volume2, Download } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';

import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

type MetricKey =
  | 'active_workers'
  | 'total_workers'
  | 'total_expenditure'
  | 'wage_expenditure'
  | 'material_expenditure'
  | 'total_person_days'
  | 'average_days_per_household'
  | 'employment_provided_percentage'
  | 'timely_payment_percentage';

interface ComparisonDistrict {
  code: string;
  name: string;
  state: string;
  dataByYear: Record<number, any>;
  availableYears: number[];
}

const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
const quarterDistribution = [0.22, 0.25, 0.26, 0.27];

const rankingMetricOptions: { key: MetricKey; labelEn: string; labelHi: string }[] = [
  { key: 'employment_provided_percentage', labelEn: 'Employment Rate', labelHi: 'रोजगार दर' },
  { key: 'timely_payment_percentage', labelEn: 'Timely Payments', labelHi: 'समय पर भुगतान' },
  { key: 'active_workers', labelEn: 'Active Workers', labelHi: 'सक्रिय श्रमिक' },
  { key: 'total_expenditure', labelEn: 'Total Expenditure', labelHi: 'कुल व्यय' },
  { key: 'total_person_days', labelEn: 'Person Days', labelHi: 'व्यक्ति दिवस' }
];

type MetricRecord = Record<MetricKey, number>;

const createEmptyMetricRecord = (): MetricRecord => ({
  active_workers: 0,
  total_workers: 0,
  total_expenditure: 0,
  wage_expenditure: 0,
  material_expenditure: 0,
  total_person_days: 0,
  average_days_per_household: 0,
  employment_provided_percentage: 0,
  timely_payment_percentage: 0
});

interface AggregatedDistrict {
  district: ComparisonDistrict;
  totals: MetricRecord;
  averages: MetricRecord;
  validYears: number[];
}

const SUM_METRICS: MetricKey[] = [
  'active_workers',
  'total_workers',
  'total_expenditure',
  'wage_expenditure',
  'material_expenditure',
  'total_person_days'
];

const AVERAGE_METRICS: MetricKey[] = [
  'average_days_per_household',
  'employment_provided_percentage',
  'timely_payment_percentage'
];

const sumMetricSet = new Set<MetricKey>(SUM_METRICS);
const averageMetricSet = new Set<MetricKey>(AVERAGE_METRICS);

const availableDistricts = [
  { code: 'AP001', name: 'Anantapur', state: 'Andhra Pradesh' },
  { code: 'AP002', name: 'Chittoor', state: 'Andhra Pradesh' },
  { code: 'AP003', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { code: 'AS001', name: 'Kamrup', state: 'Assam' },
  { code: 'AS002', name: 'Dibrugarh', state: 'Assam' },
  { code: 'BR001', name: 'Patna', state: 'Bihar' },
  { code: 'BR002', name: 'Gaya', state: 'Bihar' },
  { code: 'CG001', name: 'Raipur', state: 'Chhattisgarh' },
  { code: 'CG002', name: 'Bilaspur', state: 'Chhattisgarh' },
  { code: 'DL001', name: 'Central Delhi', state: 'Delhi' },
  { code: 'GJ001', name: 'Ahmedabad', state: 'Gujarat' },
  { code: 'GJ002', name: 'Surat', state: 'Gujarat' },
  { code: 'GJ003', name: 'Jamnagar', state: 'Gujarat' },
  { code: 'HR001', name: 'Gurgaon', state: 'Haryana' },
  { code: 'HR002', name: 'Faridabad', state: 'Haryana' },
  { code: 'HP001', name: 'Shimla', state: 'Himachal Pradesh' },
  { code: 'HP002', name: 'Kangra', state: 'Himachal Pradesh' },
  { code: 'JH001', name: 'Ranchi', state: 'Jharkhand' },
  { code: 'JH002', name: 'Dhanbad', state: 'Jharkhand' },
  { code: 'KA001', name: 'Bangalore Urban', state: 'Karnataka' },
  { code: 'KA002', name: 'Mysuru', state: 'Karnataka' },
  { code: 'KL001', name: 'Thiruvananthapuram', state: 'Kerala' },
  { code: 'KL002', name: 'Kozhikode', state: 'Kerala' },
  { code: 'MP001', name: 'Bhopal', state: 'Madhya Pradesh' },
  { code: 'MP002', name: 'Indore', state: 'Madhya Pradesh' },
  { code: 'MH001', name: 'Mumbai', state: 'Maharashtra' },
  { code: 'MH002', name: 'Pune', state: 'Maharashtra' },
  { code: 'MH003', name: 'Nagpur', state: 'Maharashtra' },
  { code: 'MH004', name: 'Nashik', state: 'Maharashtra' },
  { code: 'OR001', name: 'Khordha', state: 'Odisha' },
  { code: 'OR002', name: 'Sambalpur', state: 'Odisha' },
  { code: 'PB001', name: 'Ludhiana', state: 'Punjab' },
  { code: 'PB002', name: 'Amritsar', state: 'Punjab' },
  { code: 'RJ001', name: 'Jaipur', state: 'Rajasthan' },
  { code: 'RJ002', name: 'Jodhpur', state: 'Rajasthan' },
  { code: 'TN001', name: 'Chennai', state: 'Tamil Nadu' },
  { code: 'TN002', name: 'Coimbatore', state: 'Tamil Nadu' },
  { code: 'TG001', name: 'Hyderabad', state: 'Telangana' },
  { code: 'TG002', name: 'Warangal', state: 'Telangana' },
  { code: 'UP001', name: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'UP002', name: 'Kanpur Nagar', state: 'Uttar Pradesh' },
  { code: 'UP003', name: 'Varanasi', state: 'Uttar Pradesh' },
  { code: 'WB001', name: 'Kolkata', state: 'West Bengal' },
  { code: 'WB002', name: 'Darjeeling', state: 'West Bengal' }
];

let chartRegistered = false;

const ComparePage: React.FC = () => {
  const { language } = useLanguage();
  const { fetchDistrictData } = useData();
  const [selectedDistricts, setSelectedDistricts] = useState<ComparisonDistrict[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingDistrict, setIsAddingDistrict] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState<string | null>(null);
  const supportedYears = useMemo(() => [2024, 2023, 2022, 2021, 2020], []);
  const [startYear, setStartYear] = useState(() => supportedYears[supportedYears.length - 1]);
  const [endYear, setEndYear] = useState(() => supportedYears[0]);
  const [timeGranularity, setTimeGranularity] = useState<'annual' | 'quarterly'>('annual');
  const [rankingMetric, setRankingMetric] = useState<MetricKey>('employment_provided_percentage');

  const activeYearRange = useMemo(
    () => supportedYears.filter((year) => year >= startYear && year <= endYear).sort((a, b) => a - b),
    [supportedYears, startYear, endYear]
  );

  const aggregatedDistricts = useMemo(
    () =>
      selectedDistricts.map((district) => {
        const totals = createEmptyMetricRecord();
        const averages = createEmptyMetricRecord();
        const validYears = activeYearRange.filter((year) => district.dataByYear[year]);

        validYears.forEach((year) => {
          const data = district.dataByYear[year];
          if (!data) return;
          SUM_METRICS.forEach((key) => {
            totals[key] += data?.[key] ?? 0;
          });
          AVERAGE_METRICS.forEach((key) => {
            averages[key] += data?.[key] ?? 0;
          });
        });

        AVERAGE_METRICS.forEach((key) => {
          averages[key] = validYears.length ? averages[key] / validYears.length : 0;
        });

        return {
          district,
          totals,
          averages,
          validYears
        };
      }),
    [selectedDistricts, activeYearRange]
  );

  useEffect(() => {
    if (!chartRegistered) {
      ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);
      chartRegistered = true;
    }
  }, []);

  const filteredDistricts = availableDistricts
    .filter((district) =>
      district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((district) => !selectedDistricts.some((selected) => selected.code === district.code));

  const ensureYearData = async (districtCode: string, year: number) => {
    const cacheKey = `${districtCode}-${year}`;
    const existing = selectedDistricts.find((d) => d.code === districtCode)?.dataByYear?.[year];
    if (existing) return existing;

    const data = await fetchDistrictData(districtCode, year);
    return data;
  };

  const addDistrict = async (district: { code: string; name: string; state: string }) => {
    setLoadingDistrict(district.code);
    try {
      const districtYears = supportedYears.filter((year) => year >= startYear && year <= endYear);
      const dataEntries = await Promise.all(districtYears.map((year) => ensureYearData(district.code, year)));

      const dataByYear: Record<number, any> = {};
      dataEntries.forEach((entry, index) => {
        if (entry) {
          dataByYear[districtYears[index]] = entry;
        }
      });

      if (Object.keys(dataByYear).length > 0) {
        const newDistrict: ComparisonDistrict = {
          code: district.code,
          name: district.name,
          state: district.state,
          dataByYear,
          availableYears: Object.keys(dataByYear).map((year) => Number(year))
        };
        setSelectedDistricts((prev) => [...prev, newDistrict]);
        setIsAddingDistrict(false);
        setSearchTerm('');
      } else {
        alert(`Failed to load data for ${district.name}. Please try again.`);
      }
    } catch (error) {
      console.error('Error adding district', error);
      alert(`Error loading ${district.name}. Please try again.`);
    } finally {
      setLoadingDistrict(null);
    }
  };

  const removeDistrict = (code: string) => {
    setSelectedDistricts((prev) => prev.filter((district) => district.code !== code));
  };

  const handleVoiceComparison = () => {
    if (selectedDistricts.length === 0) return;

    try {
      const highestEmploymentDistrict = selectedDistricts.reduce((max, district) => {
        const maxWorkers = Math.max(
          ...Object.values(max.dataByYear).map((data: any) => data?.active_workers ?? 0)
        );
        const currentWorkers = Math.max(
          ...Object.values(district.dataByYear).map((data: any) => data?.active_workers ?? 0)
        );
        return currentWorkers > maxWorkers ? district : max;
      });

      const text = language === 'hi'
        ? `${selectedDistricts.length} जिलों की तुलना। सबसे अधिक रोजगार ${highestEmploymentDistrict.name} में है।`
        : `Comparing ${selectedDistricts.length} districts. Highest employment is in ${highestEmploymentDistrict.name}.`;

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error in voice comparison', error);
    }
  };


  const getMetricComparison = (metric: MetricKey) => {
    if (selectedDistricts.length === 0) {
      return [] as { name: string; state: string; value: number; code: string }[];
    }

    return selectedDistricts
      .map((district) => {
        const years = activeYearRange.filter((year) => district.dataByYear[year]);
        const values = years.map((year) => district.dataByYear[year]?.[metric] ?? 0);
        const averageValue = values.length ? values.reduce((acc, value) => acc + value, 0) / values.length : 0;

        return {
          name: district.name,
          state: district.state,
          value: averageValue,
          code: district.code
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  const handleDownloadComparison = () => {
    if (selectedDistricts.length === 0) return;

    const headers = [
      'District Code',
      'District',
      'State',
      'Years',
      'Active Workers',
      'Total Workers',
      'Total Expenditure (₹L)',
      'Wage Expenditure (₹L)',
      'Material Expenditure (₹L)',
      'Person Days',
      'Average Days per HH',
      'Employment Rate (%)',
      'Timely Payment (%)'
    ];

    const rows = selectedDistricts.map((district) => {
      const years = activeYearRange.filter((year) => district.dataByYear[year]);
      const aggregate = years.reduce(
        (acc, year) => {
          const data = district.dataByYear[year];
          return {
            active_workers: acc.active_workers + (data?.active_workers ?? 0),
            total_workers: acc.total_workers + (data?.total_workers ?? 0),
            total_expenditure: acc.total_expenditure + (data?.total_expenditure ?? 0),
            wage_expenditure: acc.wage_expenditure + (data?.wage_expenditure ?? 0),
            material_expenditure: acc.material_expenditure + (data?.material_expenditure ?? 0),
            total_person_days: acc.total_person_days + (data?.total_person_days ?? 0),
            average_days_per_household: acc.average_days_per_household + (data?.average_days_per_household ?? 0),
            employment_provided_percentage:
              acc.employment_provided_percentage + (data?.employment_provided_percentage ?? 0),
            timely_payment_percentage:
              acc.timely_payment_percentage + (data?.timely_payment_percentage ?? 0)
          };
        },
        {
          active_workers: 0,
          total_workers: 0,
          total_expenditure: 0,
          wage_expenditure: 0,
          material_expenditure: 0,
          total_person_days: 0,
          average_days_per_household: 0,
          employment_provided_percentage: 0,
          timely_payment_percentage: 0
        }
      );

      const divisor = Math.max(years.length, 1);

      return [
        district.code,
        district.name,
        district.state,
        years.join(' - '),
        aggregate.active_workers,
        aggregate.total_workers,
        (aggregate.total_expenditure).toFixed(1),
        (aggregate.wage_expenditure).toFixed(1),
        (aggregate.material_expenditure).toFixed(1),
        aggregate.total_person_days,
        (aggregate.average_days_per_household / divisor).toFixed(2),
        (aggregate.employment_provided_percentage / divisor).toFixed(1),
        (aggregate.timely_payment_percentage / divisor).toFixed(1)
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `MGNREGA_Comparison_${startYear}-${endYear}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  };

  const years = [2024, 2023, 2022, 2021, 2020];
  const hasComparison = selectedDistricts.length > 1;

  const chartLabels = useMemo(
    () => selectedDistricts.map((district) => `${district.name} (${district.state})`),
    [selectedDistricts]
  );

  const employmentChartData = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          label: language === 'hi' ? 'सक्रिय श्रमिक' : 'Active Workers',
          data: aggregatedDistricts.map((item) => item.totals.active_workers),
          backgroundColor: 'rgba(19, 136, 8, 0.65)',
          borderRadius: 12
        },
        {
          label: language === 'hi' ? 'कुल श्रमिक' : 'Total Workers',
          data: aggregatedDistricts.map((item) => item.totals.total_workers),
          backgroundColor: 'rgba(255, 153, 51, 0.6)',
          borderRadius: 12
        }
      ]
    }),
    [chartLabels, aggregatedDistricts, language]
  );

  const expenditureChartData = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          label: language === 'hi' ? 'मजदूरी व्यय (₹ लाख)' : 'Wage Expenditure (₹L)',
          data: aggregatedDistricts.map((item) => Number(item.totals.wage_expenditure.toFixed(2))),
          backgroundColor: 'rgba(21, 101, 192, 0.6)',
          borderRadius: 12
        },
        {
          label: language === 'hi' ? 'सामग्री व्यय (₹ लाख)' : 'Material Expenditure (₹L)',
          data: aggregatedDistricts.map((item) => Number(item.totals.material_expenditure.toFixed(2))),
          backgroundColor: 'rgba(244, 143, 177, 0.6)',
          borderRadius: 12
        }
      ]
    }),
    [chartLabels, aggregatedDistricts, language]
  );

  const performanceChartData = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          label: language === 'hi' ? 'रोजगार दर (%)' : 'Employment Rate (%)',
          data: aggregatedDistricts.map((item) => Number(item.averages.employment_provided_percentage.toFixed(2))),
          borderColor: 'rgba(67, 160, 71, 0.9)',
          backgroundColor: 'rgba(67, 160, 71, 0.25)',
          pointRadius: 4,
          tension: 0.3,
          fill: true
        },
        {
          label: language === 'hi' ? 'समय पर भुगतान (%)' : 'Timely Payment (%)',
          data: aggregatedDistricts.map((item) => Number(item.averages.timely_payment_percentage.toFixed(2))),
          borderColor: 'rgba(255, 152, 0, 0.9)',
          backgroundColor: 'rgba(255, 152, 0, 0.25)',
          pointRadius: 4,
          tension: 0.3,
          fill: true
        }
      ]
    }),
    [chartLabels, aggregatedDistricts, language]
  );

  const barOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y ?? 0;
              return `${context.dataset.label}: ${value.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          },
          ticks: {
            callback: (value) => (typeof value === 'number' ? value.toLocaleString() : value)
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }),
    []
  );

  const lineOptions: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y ?? 0;
              return `${context.dataset.label}: ${value.toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            callback: (value) => (typeof value === 'number' ? `${value.toFixed(0)}%` : value)
          }
        }
      }
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="btn-icon-large bg-gray-100 hover:bg-gray-200">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {language === 'hi' ? 'जिलों की तुलना' : 'Compare Districts'}
                </h1>
                <p className="text-lg text-gray-600">
                  {language === 'hi' ? 'मनरेगा प्रदर्शन की तुलना करें' : 'Compare MGNREGA Performance'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-between space-x-3">
              <div className="flex items-center space-x-2">
                <select
                  value={startYear}
                  onChange={(event) => setStartYear(Number(event.target.value))}
                  className="input-rural py-2 px-3 text-sm"
                >
                  {supportedYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <span className="text-gray-500">to</span>
                <select
                  value={endYear}
                  onChange={(event) => setEndYear(Number(event.target.value))}
                  className="input-rural py-2 px-3 text-sm"
                >
                  {supportedYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDistricts.length > 0 && (
                <button
                  onClick={handleVoiceComparison}
                  className="btn-icon-large bg-blue-100 hover:bg-blue-200 text-blue-600"
                  title={language === 'hi' ? 'तुलना सुनें' : 'Listen to Comparison'}
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'hi' ? 'जिले चुनें' : 'Select Districts'}
            </h2>
            <button
              onClick={() => setIsAddingDistrict(true)}
              className="btn-rural-primary flex items-center space-x-2"
              disabled={selectedDistricts.length >= 5}
            >
              <Plus className="w-5 h-5" />
              <span>{language === 'hi' ? 'जिला जोड़ें' : 'Add District'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {selectedDistricts.map((district) => (
              <div key={district.code} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{district.name}</h3>
                  <p className="text-sm text-gray-600">{district.state}</p>
                </div>
                <button
                  onClick={() => removeDistrict(district.code)}
                  className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {isAddingDistrict && (
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'जिला या राज्य खोजें...' : 'Search district or state...'}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="input-rural flex-1"
                />
                <button onClick={() => setIsAddingDistrict(false)} className="btn-rural-secondary">
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredDistricts.map((district) => {
                  const isLoading = loadingDistrict === district.code;
                  return (
                    <button
                      key={district.code}
                      onClick={() => addDistrict(district)}
                      disabled={isLoading}
                      className={`w-full text-left p-3 bg-gray-50 rounded-lg transition-colors border border-transparent ${
                        isLoading ? 'opacity-60 cursor-wait' : 'hover:bg-gray-100 cursor-pointer'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{district.name}</div>
                      <div className="text-sm text-gray-600">{district.state}</div>
                      {isLoading && (
                        <div className="text-xs text-orange-600 mt-2">
                          {language === 'hi' ? 'डेटा लाया जा रहा है...' : 'Fetching data...'}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {hasComparison && (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 text-green-600 mr-2" />
                {language === 'hi' ? 'मुख्य मेट्रिक्स की तुलना' : 'Key Metrics Comparison'}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[
                  {
                    metric: 'active_workers' as MetricKey,
                    icon: <Users className="w-5 h-5 text-blue-600 mr-2" />,
                    titleHi: 'सक्रिय श्रमिक',
                    titleEn: 'Active Workers',
                    format: (value: number) => value.toLocaleString()
                  },
                  {
                    metric: 'total_expenditure' as MetricKey,
                    icon: <IndianRupee className="w-5 h-5 text-green-600 mr-2" />,
                    titleHi: 'कुल व्यय (लाख ₹)',
                    titleEn: 'Total Expenditure (₹ Lakhs)',
                    format: (value: number) => `₹${value.toFixed(1)}L`
                  },
                  {
                    metric: 'total_person_days' as MetricKey,
                    icon: <Calendar className="w-5 h-5 text-orange-600 mr-2" />,
                    titleHi: 'व्यक्ति दिवस',
                    titleEn: 'Person Days',
                    format: (value: number) => value.toLocaleString()
                  },
                  {
                    metric: 'employment_provided_percentage' as MetricKey,
                    icon: <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />,
                    titleHi: 'रोजगार दर (%)',
                    titleEn: 'Employment Rate (%)',
                    format: (value: number) => `${value.toFixed(1)}%`
                  }
                ].map((config) => {
                  const metricData = getMetricComparison(config.metric);
                  return (
                    <div key={config.metric}>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        {config.icon}
                        {language === 'hi' ? config.titleHi : config.titleEn}
                      </h4>
                      <div className="space-y-3">
                        {metricData.map((item, index) => (
                          <div key={item.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                  index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-gray-500'
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-600">{item.state}</div>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {config.format(item.value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'hi' ? 'एनालिटिक्स चार्ट' : 'Analytics & Charts'}
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 h-80">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {language === 'hi' ? 'श्रमिक तुलना' : 'Workforce Comparison'}
                  </h4>
                  <Bar data={employmentChartData} options={barOptions} />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 h-80">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {language === 'hi' ? 'व्यय विश्लेषण' : 'Expenditure Analysis'}
                  </h4>
                  <Bar data={expenditureChartData} options={barOptions} />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 h-80 xl:col-span-2">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {language === 'hi' ? 'प्रदर्शन प्रवृत्तियाँ' : 'Performance Trends'}
                  </h4>
                  <Line data={performanceChartData} options={lineOptions} />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 text-yellow-600 mr-2" />
                {language === 'hi' ? 'तुलना सारांश' : 'Comparison Summary'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {language === 'hi' ? 'सर्वश्रेष्ठ प्रदर्शन' : 'Best Performer'}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {getMetricComparison('employment_provided_percentage')[0]?.name ?? '—'}
                  </p>
                  <p className="text-sm text-green-700">
                    {language === 'hi' ? 'रोजगार दर में' : 'in Employment Rate'}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IndianRupee className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {language === 'hi' ? 'सर्वाधिक निवेश' : 'Highest Investment'}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {getMetricComparison('total_expenditure')[0]?.name ?? '—'}
                  </p>
                  <p className="text-sm text-blue-700">
                    ₹{getMetricComparison('total_expenditure')[0]?.value.toFixed(1) ?? '0.0'}L
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {language === 'hi' ? 'सर्वाधिक रोजगार' : 'Most Employment'}
                  </p>
                  <p className="text-lg font-bold text-orange-600">
                    {getMetricComparison('active_workers')[0]?.name ?? '—'}
                  </p>
                  <p className="text-sm text-orange-700">
                    {(getMetricComparison('active_workers')[0]?.value ?? 0).toLocaleString()} {language === 'hi' ? 'श्रमिक' : 'workers'}
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownloadComparison}
                className="btn-rural-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>{language === 'hi' ? 'तुलना रिपोर्ट डाउनलोड करें' : 'Download Comparison Report'}</span>
              </button>
            </div>
          </div>
        )}

        {selectedDistricts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? 'तुलना शुरू करें' : 'Start Comparing'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {language === 'hi'
                ? 'कम से कम 2 जिले चुनें और उनके मनरेगा प्रदर्शन की तुलना करें'
                : 'Select at least 2 districts to compare their MGNREGA performance'}
            </p>
            <button onClick={() => setIsAddingDistrict(true)} className="btn-rural-primary">
              {language === 'hi' ? 'पहला जिला जोड़ें' : 'Add First District'}
            </button>
          </div>
        )}

        {selectedDistricts.length === 1 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'hi' ? 'एक और जिला जोड़ें' : 'Add Another District'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {language === 'hi'
                ? 'तुलना के लिए कम से कम एक और जिला चुनें'
                : 'Select at least one more district for comparison'}
            </p>
            <button onClick={() => setIsAddingDistrict(true)} className="btn-rural-primary">
              {language === 'hi' ? 'दूसरा जिला जोड़ें' : 'Add Second District'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComparePage;
