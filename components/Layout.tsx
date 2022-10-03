import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';

const Layout = ({
  children,
  pageProps,
}: {
  children: ReactNode;
  pageProps: Record<string, any>;
}) => {
  const isPreviewing = useIsPreviewing();
  const router = useRouter();
  const builderContent = pageProps.builderContent || {};
  const { header, footer } = builderContent;

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  //  Add your error page here to return if there are no matching
  //  content entries published in Builder.
  if ((!header || !footer) && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <BuilderComponent model="header" content={header} />
      <main>{children}</main>
      <BuilderComponent model="footer" content={footer} />
    </>
  );
};

export { Layout };
