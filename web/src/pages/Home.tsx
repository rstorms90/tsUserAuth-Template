import React from 'react';

interface Props {}

export const Home: React.FC<Props> = () => {
  return (
    <div className="page">
      <h1 className="page-title">Project Feather</h1>
      <h4 className="page-sub-title">Construct your story!</h4>
    </div>
  );
};
