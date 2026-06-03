import dynamic from 'next/dynamic';

const AppLoading = () => (
  <div className="app flex-row align-items-center">
    <div className="container text-center">
      <div className="animated fadeIn pt-3">Loading...</div>
    </div>
  </div>
);

const NextClientApp = dynamic(() => import('../src/client/NextClientApp'), {
  ssr: false,
  loading: AppLoading
});

export default function CatchAllPage() {
  return <NextClientApp />;
}

export function getServerSideProps({ resolvedUrl }) {
  if (resolvedUrl === '/') {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
}
