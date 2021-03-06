import React from 'react';
import AllPosts from '../../components/allPosts/AllPosts';
import Footer from '../../components/footer/Footer';
import { useMeQuery } from '../../generated/graphql';

import './Home.css';

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, loading } = useMeQuery();

  let userData: any = null;

  if (loading) {
    userData = <div>Loading...</div>;
  }

  if (!data) {
    userData = null;
  }

  if (data && !data.me?.role) {
    userData = null;
  }

  if (data && data.me?.role) {
    userData = (
      <h3>
        Welcome <span className="current-user">{data.me.username}</span>
      </h3>
    );
  }

  return (
    <div>
      <div className="Home page">
        <h1 className="page-title">HomePage</h1>
        <div className="welcome">
          <h4>Designed to mitigate police brutality.</h4>
        </div>
        {userData}
        <AllPosts />
      </div>
      <Footer />
    </div>
  );
};
