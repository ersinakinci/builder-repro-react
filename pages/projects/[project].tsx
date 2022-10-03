import { BuilderComponent, BuilderContent } from '@builder.io/react';
import {
  resolveBuilderContent,
  CommonBuilderContentProps,
} from '../../lib/resolve-builder-content';
import { getBuilderModelPaths } from '../../lib/get-builder-model-paths';
import { NextSeo } from 'next-seo';
import { Layout } from '../../components/Layout';
import { useRouter } from 'next/router';

export async function getStaticProps({ params }: { params: any }) {
  const urlPath = `/projects/${params?.project}`;
  const contentProps = await resolveBuilderContent(
    { modelName: 'project', options: { userAttributes: { urlPath } } },
    {
      modelName: 'project-template',
      options: { options: { noTargeting: true } },
    }
  );

  return {
    props: {
      builderContent: contentProps,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const paths = await getBuilderModelPaths('project');

  return {
    paths,
    fallback: true,
  };
}

export default function Page({
  builderContent,
}: {
  builderContent: CommonBuilderContentProps & {
    project: any;
    projectTemplate: any;
  };
}) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  const { project, projectTemplate } = builderContent;

  return (
    <>
      <NextSeo
        title={project?.data.title}
        description={project?.data.description}
      />
      <BuilderContent content={project} model="project">
        {(data) => {
          return (
            <>
              <BuilderComponent
                model="project-template"
                content={projectTemplate}
                data={data}
              />
            </>
          );
        }}
      </BuilderContent>
    </>
  );
}

Page.Layout = Layout;
