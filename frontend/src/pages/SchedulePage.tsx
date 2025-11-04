import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleView } from '../components/ScheduleView/ScheduleView';
import type { Selection } from '../types';

interface SchedulePageProps {
  selections: Selection[];
  onRemoveScreening: (screeningId: string) => void;
  onNavigateToCatalogue: () => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({
  selections,
  onRemoveScreening,
  onNavigateToCatalogue,
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('schedule.title', { defaultValue: 'My Schedule' })}
          </h1>
          <p className="text-gray-600">
            {t('schedule.description', {
              defaultValue: 'View and manage your selected film screenings.',
            })}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <ScheduleView
            selections={selections}
            onRemove={onRemoveScreening}
            onNavigateToCatalogue={onNavigateToCatalogue}
          />
        </div>
      </div>
    </div>
  );
};