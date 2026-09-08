import React from 'react';
import styles from './root.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LeftPanel from './left-panel/left-panel.component';
import { WorkspaceContainer } from '@openmrs/esm-framework';
import BillableServicesRoot from './billable-services/billable-services.root';

const Root: React.FC = () => {
  console.log('billing admin');
  return (
     <BrowserRouter basename={`${window.spaBase}`}>
      <LeftPanel />
      <main className={styles.container}>
        <Routes>
          <Route path="" element={<BillableServicesRoot />} />
        </Routes>
      </main>
      <WorkspaceContainer contextKey="home" />
    </BrowserRouter>
  );
};

export default Root;
