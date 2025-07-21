import { useEffect, useState } from 'react';
import './App.css';
import Home from './Home';
import Sidebar from './Sidebar';
import React from 'react';

const ACCESS_LEVEL = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

const AccessToComponentMapping = {
  [ACCESS_LEVEL.USER]: ['Home'],
  [ACCESS_LEVEL.ADMIN]: ['Home', 'Sidebar'],
};

const routes = [
  { path: 'route1', allowedAccess: ['ADMIN'] },
  { path: 'route2', allowedAccess: ['ADMIN', 'USER'] },
  { path: 'route3', allowedAccess: ['USER'] },
  { path: '/', allowedAccess: ['ADMIN', 'USER'] },
];

// this should be lazy loaded
const ComponentList = [
  { Component: Home, ComponentName: 'Home' },
  { Component: Sidebar, ComponentName: 'Sidebar' },
];

const MemoizedComponentList = ComponentList.map((compDetails) => {
  return {
    ...compDetails,
    Component: React.memo(compDetails.Component),
  };
});

const routeComponentMap = {
  route1: ['Home', 'Sidebar'],
  route2: ['Home'],
  route3: ['Sidebar'],
  '/': ['Home'],
};

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [user, _setUser] = useState({
    name: 's',
    email: 's@.com',
    accessLevel: ACCESS_LEVEL.ADMIN,
  });

  useEffect(() => {
    const onPopState = () => {
      console.log(window.location.pathname);
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const currentRoute = routes.find((r) => r.path === currentPath);

  // Redirect if not allowed
  useEffect(() => {
    if (
      !currentRoute ||
      !currentRoute.allowedAccess.includes(user.accessLevel)
    ) {
      setCurrentPath('/');
      window.history.replaceState({}, '', '/');
    }
  }, [currentRoute, user.accessLevel]);

  return (
    <div>
      {MemoizedComponentList.map(({ Component, ComponentName }) => {
        // If component is both available on the current route and accessable by user, then only render
        const renderComponent =
          // @ts-ignore
          routeComponentMap[currentRoute.path].includes(ComponentName) &&
          AccessToComponentMapping[user.accessLevel].includes(ComponentName);
        if (renderComponent) return <Component key={ComponentName} />;
        return null;
      })}
    </div>
  );
}

export default App;
