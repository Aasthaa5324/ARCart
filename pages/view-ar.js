// pages/view-ar.js
import dynamic from 'next/dynamic';

const ARViewerPage = dynamic(
  () => import('../components/ARViewerPage'),
  { ssr: false }
);

export default ARViewerPage;