import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const Container = ({
  route,
  children,
}: {
  route: { path: string; allowedAccess: string[] };
  children: ReactNode;
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 's',
    email: 's@.com',
    accessLevel: '',
  });

  if (
    !route.allowedAccess.includes('*') &&
    !route.allowedAccess.includes(user.accessLevel)
  ) {
    navigate('/');
    return null;
  }

  return children;
};

export default Container;
