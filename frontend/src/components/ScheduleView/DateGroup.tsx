import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Selection, ConflictInfo } from '../../types';
import { ScreeningItem } from './ScreeningItem';

interface DateGroupProps {
  date: string;
  screenings: (Selection & { conflicts?: ConflictInfo[] })[];
  onRemoveScreening: (screeningId: string) => void;
}

export const DateGroup: React.FC<DateGroupProps> = ({
  date,
  screenings,
  onRemoveScreening,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  // Format date header
  const formatDateHeader = (dateStr: string): string => {
    const dateObj = new Date(dateStr);
    const dayOfWeek = format(dateObj, 'EEEE');

    if (isZh) {
      const month = format(dateObj, 'M');
      const day = format(dateObj, 'd');
      const weekdayMap: { [key: string]: string } = {
        'Monday': '星期一',
        'Tuesday': '星期二',
        'Wednesday': '星期三',
        'Thursday': '星期四',
        'Friday': '星期五',
        'Saturday': '星期六',
        'Sunday': '星期日',
      };
      return `${month}月${day}日 (${weekdayMap[dayOfWeek] || dayOfWeek})`;
    } else {
      return format(dateObj, 'MMMM d (EEEE)');
    }
  };

  return (
    <div data-testid="date-group" className="border-l-4 border-blue-500 pl-4">
      <h3 data-testid="date-header" className="text-lg font-semibold text-foreground mb-4">
        {formatDateHeader(date)}
      </h3>

      <div className="space-y-3">
        {screenings.map((screening) => (
          <ScreeningItem
            key={screening.screening_id}
            selection={screening}
            conflicts={screening.conflicts}
            onRemove={onRemoveScreening}
          />
        ))}
      </div>
    </div>
  );
};
