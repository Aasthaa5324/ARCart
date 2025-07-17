import dynamic from 'next/dynamic';

// Dynamically import the actual map component with SSR disabled
const DynamicMap = dynamic(() => import('../components/ActualMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
        <p className="text-gray-500">Loading map...</p>
      </div>
    </div>
  )
});

// Pass through all props to the actual map component
export default function MapComponent(props) {
  return <DynamicMap {...props} />;
}