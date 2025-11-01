import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, IndianRupee, Calendar, Award, Phone, Mail, Globe, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/" className="btn-icon-large bg-white/20 hover:bg-white/30">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {language === 'hi' ? 'मनरेगा के बारे में' : 'About MGNREGA'}
              </h1>
              <p className="text-xl text-green-100 mt-2">
                {language === 'hi' ? 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम' : 'Mahatma Gandhi National Rural Employment Guarantee Act'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* MGNREGA Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'hi' ? 'मनरेगा क्या है?' : 'What is MGNREGA?'}
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {language === 'hi' 
                ? 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा) भारत सरकार का एक महत्वपूर्ण कार्यक्रम है जो ग्रामीण परिवारों को प्रति वर्ष कम से कम 100 दिन का गारंटीशुदा मजदूरी रोजगार प्रदान करता है।'
                : 'The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is a flagship program of the Government of India that provides a legal guarantee for at least 100 days of employment in a financial year to every rural household.'
              }
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'hi'
                ? 'यह योजना 2005 में शुरू की गई थी और यह दुनिया का सबसे बड़ा रोजगार गारंटी कार्यक्रम है। इसका मुख्य उद्देश्य ग्रामीण क्षेत्रों में आजीविका सुरक्षा बढ़ाना है।'
                : 'Launched in 2005, it is the world\'s largest employment guarantee program. Its primary objective is to enhance livelihood security in rural areas by providing guaranteed wage employment.'
              }
            </p>
          </div>
        </div>

        {/* Program Pillars */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'hi' ? 'मनरेगा की प्रमुख स्तंभ' : 'Pillars of MGNREGA'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                titleEn: 'Employment Security',
                titleHi: 'रोज़गार सुरक्षा',
                descriptionEn: 'Legal guarantee of 100 days wage employment for every willing rural household.',
                descriptionHi: 'हर इच्छुक ग्रामीण परिवार के लिए 100 दिनों की मज़दूरी का कानूनी अधिकार सुनिश्चित करता है।'
              },
              {
                titleEn: 'Inclusive Development',
                titleHi: 'समावेशी विकास',
                descriptionEn: 'Priority to socially vulnerable groups, women participation above 33%, and local decision making.',
                descriptionHi: 'समाजिक रूप से कमजोर समूहों को प्राथमिकता, 33% से अधिक महिला भागीदारी एवं स्थानीय निर्णय प्रक्रिया।'
              },
              {
                titleEn: 'Asset Creation',
                titleHi: 'स्थायी परिसंपत्तियाँ',
                descriptionEn: 'Focus on water conservation, soil fertility, and rural infrastructure that benefits communities long-term.',
                descriptionHi: 'जल संरक्षण, मिट्टी की उर्वरता एवं ग्रामीण आधारभूत संरचना पर ध्यान जो समुदाय को दीर्घकालिक लाभ दे।'
              },
              {
                titleEn: 'Transparency & Accountability',
                titleHi: 'पारदर्शिता व उत्तरदायित्व',
                descriptionEn: 'Social audits, muster rolls on display, and digital payments to ensure timely, fair wages.',
                descriptionHi: 'सामाजिक अंकेक्षण, मस्टर रोल प्रदर्शन व डिजिटल भुगतान से समय पर तथा न्यायपूर्ण मज़दूरी सुनिश्चित।'
              }
            ].map((pillar, index) => (
              <div key={index} className="p-6 border border-orange-100 rounded-xl bg-orange-50/40">
                <h3 className="text-lg font-semibold text-orange-700 mb-2">
                  {language === 'hi' ? pillar.titleHi : pillar.titleEn}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'hi' ? pillar.descriptionHi : pillar.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'hi' ? 'मुख्य विशेषताएं' : 'Key Features'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? '100 दिन की गारंटी' : '100 Days Guarantee'}
                  </h4>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'प्रत्येक परिवार को प्रति वर्ष कम से कम 100 दिन का काम' : 'At least 100 days of work per household per year'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'न्यूनतम मजदूरी' : 'Minimum Wages'}
                  </h4>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'राज्य के न्यूनतम मजदूरी कानून के अनुसार भुगतान' : 'Payment as per state minimum wage laws'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'महिला सशक्तिकरण' : 'Women Empowerment'}
                  </h4>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'कम से कम 33% महिला भागीदारी सुनिश्चित' : 'At least 33% women participation ensured'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'hi' ? 'हमारे ऐप की विशेषताएं' : 'Our App Features'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                  <Globe className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'रियल-टाइम डेटा' : 'Real-time Data'}
                  </h4>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'सरकारी स्रोतों से नवीनतम जानकारी' : 'Latest information from government sources'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                  <Heart className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'ग्रामीण-अनुकूल डिज़ाइन' : 'Rural-friendly Design'}
                  </h4>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'बड़े बटन और आसान नेवीगेशन' : 'Large buttons and easy navigation'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-1">
                  <Award className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'आवाज़ सहायता' : 'Voice Support'}
                  </h4>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'डेटा को सुनने की सुविधा' : 'Audio narration of key data'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'hi' ? 'सिस्टम आर्किटेक्चर' : 'System Architecture'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="metric-icon">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'React फ्रंटएंड' : 'React Frontend'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'hi'
                      ? 'मोबाइल-प्रथम UI, द्विभाषी सपोर्ट और वॉइस नेरेशन के साथ।'
                      : 'Mobile-first UI with bilingual support and voice narration.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="metric-icon-accent">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'FastAPI मिडल टियर' : 'FastAPI Middle Tier'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'hi'
                      ? 'डेटा वैलिडेशन, रेट लिमिटिंग और कैशिंग लेयर के साथ हल्का API.'
                      : 'Lightweight API with validation, rate limiting, and caching layer.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="metric-icon-neutral">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'SQLite कैश' : 'SQLite Cache'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'hi'
                      ? 'कम कनेक्टिविटी क्षेत्रों के लिए ऑफलाइन बैकअप और तेज़ प्रतिक्रियाएँ.'
                      : 'Offline fallback and rapid responses for low-connectivity regions.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="metric-icon">
                  <span className="text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'hi' ? 'data.gov.in इंटिग्रेशन' : 'data.gov.in Integration'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'hi'
                      ? 'सरकारी ओपन डेटा से प्रत्यक्ष अद्यतन, विश्वसनीय स्रोत.'
                      : 'Direct refresh from official open-data APIs for trusted sources.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-6 space-y-4">
              <h4 className="text-lg font-semibold text-orange-700">
                {language === 'hi' ? 'इंजीनियरिंग मुख्य बिंदु' : 'Engineering Highlights'}
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                <li>{language === 'hi' ? 'कैशिंग लेयर से API विश्वसनीयता में सुधार' : 'Caching layer improves API reliability during outages.'}</li>
                <li>{language === 'hi' ? 'कम बैंडविड्थ पर भी <3 सेकंड लोड समय' : 'Sub-3s load on 3G with lightweight assets.'}</li>
                <li>{language === 'hi' ? 'द्विभाषी वॉयस व टेक्स्ट एक्सेसिबिलिटी लेयर' : 'Bilingual accessibility layer for text and voice.'}</li>
                <li>{language === 'hi' ? 'समुदाय के लिए ऑफलाइन डेटा फॉल-बैक' : 'Offline data fallback for rural connectivity challenges.'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {language === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {language === 'hi' ? 'हेल्पलाइन' : 'Helpline'}
              </h4>
              <a href="tel:18003452244" className="text-lg font-bold text-green-600 hover:text-green-700">
                1800-345-2244
              </a>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'सुबह 9 बजे से शाम 6 बजे तक' : '9 AM to 6 PM'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {language === 'hi' ? 'ईमेल' : 'Email'}
              </h4>
              <a href="mailto:mgnrega@gov.in" className="text-blue-600 hover:text-blue-700">
                mgnrega@gov.in
              </a>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'आधिकारिक सहायता' : 'Official Support'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {language === 'hi' ? 'वेबसाइट' : 'Website'}
              </h4>
              <a 
                href="https://nrega.nic.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700"
              >
                nrega.nic.in
              </a>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'आधिकारिक पोर्टल' : 'Official Portal'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
