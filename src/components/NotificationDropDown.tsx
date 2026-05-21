import { useState } from "react";
import { PopoverLayout } from "./HeadlessUI";

export interface NotificationItem {
  id: number;
  text: string;
  subText: string;
  icon?: string;
  bgColor?: string;
  createdAt: Date;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
}

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

const NotificationDropdown = ({ notifications }: NotificationDropdownProps) => {
  const Toggler = () => (
    <div className="relative">
      <i className="mgc_notification_line text-2xl"></i>
      {notifications.length > 0 && (
        <span className="absolute -top-1 -end-1 flex items-center justify-center h-4 w-4 rounded-full bg-danger text-white text-xs">
          {notifications.length}
        </span>
      )}
    </div>
  );

  return (
    <PopoverLayout
      placement="bottom-end"
      toggler={<Toggler />}
      togglerClass="nav-link p-2"
      menuClass="w-80 z-50 mt-2 bg-white shadow-lg border rounded-lg dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="p-3 border-b dark:border-gray-700">
        <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h6>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            {n.icon && (
              <div className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-${n.bgColor ?? 'primary'}/10`}>
                <i className={`${n.icon} text-${n.bgColor ?? 'primary'}`}></i>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{n.text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.subText}</p>
              <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 text-center border-t dark:border-gray-700">
        <button className="text-xs text-primary hover:underline">View all notifications</button>
      </div>
    </PopoverLayout>
  );
};

export default NotificationDropdown;
