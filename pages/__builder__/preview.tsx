import { GetServerSideProps } from 'next';
import { BuilderComponent } from '@builder.io/react';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { model } = query;

  return {
    props: { model },
  };
};

export default function Page({ model }: { model: string }) {
  return <BuilderComponent model={model} />;
}
