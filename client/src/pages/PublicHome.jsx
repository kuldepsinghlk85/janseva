import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import Navbar from '../components/public/Navbar';
import FestivalBanner from '../components/public/FestivalBanner';
import HeroSection from '../components/public/HeroSection';
import MetricsBar from '../components/public/MetricsBar';
import LatestUpdates from '../components/public/LatestUpdates';
import LeaderSocialSection from '../components/public/LeaderSocialSection';
import ConstituencyAndQR from '../components/public/ConstituencyAndQR';
import SchemesSection from '../components/public/SchemesSection';
import BottomBanner from '../components/public/BottomBanner';
import ConstituencyMap from '../components/public/ConstituencyMap';
import DevelopmentTimeline from '../components/public/DevelopmentTimeline';
import PopularCategories from '../components/public/PopularCategories';
import CitizenConnectQR from '../components/public/CitizenConnectQR';
import FooterPanorama from '../components/public/FooterPanorama';
import CitizenRegistrationModal from '../components/public/CitizenRegistrationModal';
import MobileSimulator from '../components/public/MobileSimulator';
import HomepageFeatureCard from '../components/public/HomepageFeatureCard';
import HomeActivitiesAndMinistersSection from '../components/public/HomeActivitiesAndMinistersSection';
import HomeSocialAndConstituencyRow from '../components/public/HomeSocialAndConstituencyRow';
import HomeUpdatesAndSchemesRow from '../components/public/HomeUpdatesAndSchemesRow';
import HomeTimelineAndTeamRow from '../components/public/HomeTimelineAndTeamRow';
import ActivityDetailModal from '../components/public/ActivityDetailModal';
import OfficialMlaBanner from '../components/public/OfficialMlaBanner';
import KnowYourConstituency from '../components/public/KnowYourConstituency';
import JanSamvadHomeSpotlight from '../components/public/JanSamvadHomeSpotlight';
import UserLoginModal from '../components/public/UserLoginModal';

export default function PublicHome() {

  const { settings, loading } = useApp();
  const [activities, setActivities] = useState([]);
  const [sliderActivities, setSliderActivities] = useState([]);
  const [featuredActivity, setFeaturedActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        const [actsRes, sliderRes, featRes] = await Promise.all([
          api.getActivities(),
          api.getFeaturedSliderActivities(),
          api.getFeaturedActivity()
        ]);
        if (actsRes && actsRes.success) {
          setActivities(actsRes.data || []);
        }
        if (sliderRes && sliderRes.success && sliderRes.data && sliderRes.data.length > 0) {
          setSliderActivities(sliderRes.data);
          setFeaturedActivity(sliderRes.data[0]);
        } else if (featRes && featRes.success && featRes.data) {
          setSliderActivities([featRes.data]);
          setFeaturedActivity(featRes.data);
        } else if (actsRes && actsRes.data && actsRes.data.length > 0) {
          setSliderActivities(actsRes.data.slice(0, 4));
          setFeaturedActivity(actsRes.data[0]);
        }
      } catch (e) {
        console.error('Failed to load activities', e);
      }
    };
    fetchActivitiesData();
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-700">जनसेवा इटावा (200) पोर्टल लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  const modules = settings?.modules || {};

  // Dynamic section rendering based on admin Section Manager and Template ordering
  const configuredSections = Array.isArray(settings?.sections) && settings.sections.length > 0
    ? [...settings.sections].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [
        { id: 'about-mla', enabled: true },
        { id: 'hero-banner', enabled: true },
        { id: 'development-highlights', enabled: true },
        { id: 'social-feed', enabled: true },
        { id: 'latest-news', enabled: true },
        { id: 'upcoming-events', enabled: true },
        { id: 'testimonial', enabled: true }
      ];

  const renderSection = (secId) => {
    switch (secId) {
      case 'about-mla':
        return modules.officialMlaBanner !== false ? <OfficialMlaBanner key="about-mla" /> : null;
      case 'hero-banner':
        return (
          <React.Fragment key="hero-spotlight-group">
            {modules.heroSlider !== false && <HeroSection key="hero-slider" />}
            {modules.janSamvadSpotlight !== false && <JanSamvadHomeSpotlight key="jansamvad-spotlight" />}
          </React.Fragment>
        );
      case 'development-highlights':
        return (
          <React.Fragment key="dev-highlights">
            {modules.metricsBar !== false && <MetricsBar key="metrics-bar" />}
            {modules.featuredActivity !== false && (
              <HomepageFeatureCard
                key="featured-card"
                activities={sliderActivities}
                activity={featuredActivity}
                onReadMore={(act) => setSelectedActivity(act)}
              />
            )}
            {modules.updatesAndSchemes !== false && (
              <HomeUpdatesAndSchemesRow
                key="updates-schemes"
                activities={activities}
                onSelectActivity={(act) => setSelectedActivity(act)}
              />
            )}
          </React.Fragment>
        );
      case 'social-feed':
        return (
          <React.Fragment key="social-feed">
            {modules.socialAndConstituency !== false && <HomeSocialAndConstituencyRow key="social-row" />}
            {modules.knowYourConstituency !== false && <KnowYourConstituency key="constituency-info" />}
          </React.Fragment>
        );
      case 'latest-news':
        return modules.latestActivitiesAndMinisters !== false ? (
          <HomeActivitiesAndMinistersSection
            key="latest-news"
            activities={activities}
            onSelectActivity={(act) => setSelectedActivity(act)}
          />
        ) : null;
      case 'upcoming-events':
        return modules.timelineAndTeam !== false ? <HomeTimelineAndTeamRow key="upcoming-events" /> : null;
      case 'testimonial':
        return modules.citizenTestimonial !== false ? <BottomBanner key="testimonial" /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Custom CSS overrides from Admin Custom CSS/JS */}
      {settings?.customCode?.css && (
        <style dangerouslySetInnerHTML={{ __html: settings.customCode.css }} />
      )}

      <Navbar />
      {modules.festivalBanner !== false && <FestivalBanner />}

      <main className="flex-1">
        {configuredSections
          .filter((sec) => sec.enabled !== false)
          .map((sec) => renderSection(sec.id))}
      </main>

      {modules.footerPanorama !== false && <FooterPanorama />}
      {modules.floatingMobileSimulator !== false && <MobileSimulator />}
      {modules.floatingQrModal !== false && <CitizenRegistrationModal />}
      <UserLoginModal />

      {/* Auto-generated Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onTagClick={(tag) => {
          setActiveTag(tag);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
}

