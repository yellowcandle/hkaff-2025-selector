import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConflictInfo } from '../../types';

interface ConflictWarningProps {
  conflict: ConflictInfo;
}

export const ConflictWarning: React.FC<ConflictWarningProps> = ({ conflict }) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const message = isZh ? conflict.message_tc : conflict.message_en;
  const isImpossible = conflict.severity === 'impossible';

  return (
    <div
      data-testid="conflict-warning"
      className={`flex items-start gap-2 p-3 rounded-md ${
        isImpossible
          ? 'bg-red-50 border border-red-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}
    >
      {/* Warning Icon */}
      <svg
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          isImpossible ? 'text-red-500' : 'text-yellow-600'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>

      {/* Message */}
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            isImpossible ? 'text-red-800' : 'text-yellow-800'
          }`}
        >
          {isImpossible
            ? (isZh ? '衝突' : 'Conflict')
            : (isZh ? '警告' : 'Warning')}
          : {message}
        </p>

        {isImpossible && (
          <p className="text-xs text-red-600 mt-1">
            {isZh
              ? '此場次與另一場次時間重疊，無法同時觀看'
              : 'This screening overlaps with another and cannot be attended simultaneously'}
          </p>
        )}
      </div>
    </div>
  );
};
