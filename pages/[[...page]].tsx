import { NextSeo } from "next-seo";
import { BuilderComponent, builder } from "@builder.io/react";
import { useRouter } from "next/router";
import { getBuilderModelPaths } from "../lib/get-builder-model-paths";
import {
  resolveBuilderContent,
  CommonBuilderContentProps,
} from "../lib/resolve-builder-content";
import { Layout } from "../components/Layout";

export async function getServerSideProps({
  params,
  query,
}: {
  params: any;
  query: any;
}) {
  const builderContent = await resolveBuilderContent({
    modelName: "page",
    options: {
      includeRefs: query.includeRefs === "true" ? true : false,
      options: {
        noTraverse: query.noTraverse === "false" ? false : true,
      },
      userAttributes: {
        urlPath: "/" + (params?.page?.join("/") || ""),
      },
    },
  });

  console.log("query", query);
  console.log("includeRefs", query.includeRefs);
  console.log("noTraverse", query.noTraverse);

  return {
    props: {
      builderContent,
      includeRefs: query.builderComponentIncludeRefs || null,
      noTraverse: query.builderComponentNoTraverse || null,
    },
  };
}

export default function Page({
  builderContent,
  includeRefs,
  noTraverse,
}: {
  builderContent: CommonBuilderContentProps & { page: any };
  includeRefs: any;
  noTraverse: any;
}) {
  console.log("builderComponentIncludeRefs", includeRefs);
  console.log("builderComponentNoTraverse", noTraverse);

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
        options={{
          includeRefs: includeRefs === "true" ? true : false,
          options: { noTraverse: noTraverse === "false" ? false : true },
        }}
      />
    </>
  );
}

Page.Layout = Layout;
