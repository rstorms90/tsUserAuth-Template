import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useMeQuery, useLogoutMutation } from '../../generated/graphql';
import { setAccessToken } from '../../accessToken';

import './Header.css';
import '../../theme.css';

interface Props {}

const Header: React.FC<Props> = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  let history = useHistory();

  let body: any = null;
  let user = data?.me;

  // Check current user
  if (loading) {
    body = null;
  } else if (data && user) {
    body = (
      <div className="loggedInInfo">
        Logged in as:
        <span className="loggedInUsername"> {user.username}</span>
      </div>
    );
  } else {
    body = null;
  }

  return (
    <header className="Header">
      <div className="logout-btn-container">
        {!loading && data && data.me && (
          <button
            className="commonBtn"
            onClick={async () => {
              await logout();
              history.push('/');
              setAccessToken('');
              await client!.resetStore();
            }}
          >
            Logout
          </button>
        )}
      </div>
      {body}
      <div className="nav-link-container">
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/about">About</Link>
        </div>
        {user && (
          <div className="nav-link">
            <Link to="/protected">Protected Route</Link>
          </div>
        )}
        {user && user.role === 'admin' && (
          <div className="nav-link">
            <Link to="/admin">Admin</Link>
          </div>
        )}

        {!user && (
          <div className="register-login-container">
            <button className="nav-link commonBtn">
              <Link to="/login">Login</Link>
            </button>
            <button className="nav-link commonBtn">
              <Link to="/register">Sign Up</Link>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
