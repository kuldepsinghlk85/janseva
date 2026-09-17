import React from 'react';
import { useApp } from '../context/AppContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminDashboard from './AdminDashboard';
import AdminWebsiteBuilder from './AdminWebsiteBuilder';
import AdminDevelopmentWorks from './AdminDevelopmentWorks';
import AdminSocialMedia from './AdminSocialMedia';
import AdminNewsRSS from './AdminNewsRSS';
import AdminBlogManager from './AdminBlogManager';
import AdminCitizenCRM from './AdminCitizenCRM';
import AdminTeamManagement from './AdminTeamManagement';
import AdminAIAssistant from './AdminAIAssistant';
import AdminAnalytics from './AdminAnalytics';
import AdminAuditLogs from './AdminAuditLogs';
import AdminMediaChanger from './AdminMediaChanger';
import AdminCommunication from './AdminCommunication';
import AdminFestivalManager from './AdminFestivalManager';
import AdminMemberManagement from './AdminMemberManagement';
import AdminActivityManager from './AdminActivityManager';
import AdminMasterDataManager from './AdminMasterDataManager';
import AdminMediaLibrary from './AdminMediaLibrary';
import AdminHeroPosterManager from './AdminHeroPosterManager';
import AdminLocationIntelligence from './AdminLocationIntelligence';
import AdminPeopleDirectory from './AdminPeopleDirectory';
import AdminMobileAppManager from './AdminMobileAppManager';
import AdminAllInOnePostCreator from './AdminAllInOnePostCreator';

export default function AdminLayout() {
  const { adminTab } = useApp();

  const renderContent = () => {
    switch (adminTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'all-in-one-post':
        return <AdminAllInOnePostCreator />;
      case 'people-directory':
        return <AdminPeopleDirectory />;
      case 'location-intelligence':
        return <AdminLocationIntelligence />;
      case 'activities':
        return <AdminActivityManager />;
      case 'master-data':
        return <AdminMasterDataManager />;
      case 'media-library':
        return <AdminMediaLibrary />;
      case 'website-builder':
        return <AdminWebsiteBuilder />;
      case 'mobile-manager':
        return <AdminMobileAppManager />;
      case 'hero-posters':
        return <AdminHeroPosterManager />;
      case 'media-changer':
        return <AdminMediaChanger />;
      case 'festival-manager':
        return <AdminFestivalManager />;
      case 'communication':
        return <AdminCommunication />;
      case 'works':
      case 'events':
        return <AdminDevelopmentWorks />;
      case 'social':
        return <AdminSocialMedia />;
      case 'news':
        return <AdminNewsRSS />;
      case 'blogs':
        return <AdminBlogManager />;
      case 'citizens':
        return <AdminCitizenCRM />;
      case 'team':
      case 'members':
        return <AdminMemberManagement />;
      case 'leaders':
        return <AdminTeamManagement />;
      case 'ai-assistant':
        return <AdminAIAssistant />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'audit':
        return <AdminAuditLogs />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900 selection:bg-orange-500 selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
