import '../styles/globals.css';
import '../components/builder.ts';
import { FC, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import type { CommonBuilderContentProps } from '../lib/resolve-builder-content';

const Noop: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

function MyApp({
  Component,
  pageProps,
}: AppProps<{ builderContent: CommonBuilderContentProps & { page: any } }>) {
  const Layout = (Component as any).Layout || Noop;

  return (
    <Layout pageProps={pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
