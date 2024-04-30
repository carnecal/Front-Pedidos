import React, { useState } from "react";

function NotificationBell() {
  const [showNotification, setShowNotification] = useState(false);

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
  };

  return (
    <div className="fixed top-0 left-0 m-4">
      <div className="relative">
        <button
          className="text-yellow-300 hover:text-gray-200 focus:outline-none"
          onClick={handleNotificationClick}
        >
          <svg
            class="w-10 h-10 text-yellow-300 dark:text-yellow"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.133 12.632v-1.8a5.407 5.407 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.933.933 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175Zm-13.267-.8a1 1 0 0 1-1-1 9.424 9.424 0 0 1 2.517-6.391A1.001 1.001 0 1 1 6.854 5.8a7.43 7.43 0 0 0-1.988 5.037 1 1 0 0 1-1 .995Zm16.268 0a1 1 0 0 1-1-1A7.431 7.431 0 0 0 17.146 5.8a1 1 0 0 1 1.471-1.354 9.424 9.424 0 0 1 2.517 6.391 1 1 0 0 1-1 .995ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
          </svg>

          {showNotification && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </button>
      </div>
      {showNotification && (
        <div className="absolute top-0 left-0 mt-8 w-64 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          <div className="p-4">¡Tienes una nueva notificación!</div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
