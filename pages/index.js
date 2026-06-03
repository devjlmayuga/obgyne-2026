export default function IndexPage() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  };
}
