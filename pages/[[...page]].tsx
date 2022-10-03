import { NextSeo } from "next-seo";
import { BuilderComponent, builder } from "@builder.io/react";
import { useRouter } from "next/router";
import { getBuilderModelPaths } from "../lib/get-builder-model-paths";
import {
  resolveBuilderContent,
  CommonBuilderContentProps,
} from "../lib/resolve-builder-content";
import { Layout } from "../components/Layout";

export async function getStaticProps({ params }: { params: any }) {
  const builderContent = await resolveBuilderContent({
    modelName: "page",
    options: {
      includeRefs: true,
      options: {
        noTraverse: false,
      },
      userAttributes: {
        urlPath: "/" + (params?.page?.join("/") || ""),
      },
    },
  });

  return {
    props: {
      builderContent,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const paths = await getBuilderModelPaths("page");

  return {
    paths: paths.map((path) => ({
      params: { page: path.split("/").filter((ps) => ps.length > 0) },
    })),
    fallback: true,
  };
}

export default function Page({
  builderContent,
}: {
  builderContent: CommonBuilderContentProps & { page: any };
}) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  const { page } = builderContent;

  return (
    <>
      <NextSeo title={page?.data.title} description={page?.data.description} />
      <BuilderComponent
        model="page"
        content={page}
        options={{ includeRefs: true, options: { noTraverse: false } }}
      />
    </>
  );
}

Page.Layout = Layout;
