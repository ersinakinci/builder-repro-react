import { GetServerSideProps } from "next";
import { BuilderComponent, builder } from "@builder.io/react";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { model, id } = query;
  let builderContent;

  if (model && id) {
    builderContent = await builder
      .get(model as string, {
        query: { id },
        options: { noTargeting: true },
      })
      .toPromise();
  } else {
    throw new Error("Missing model or id");
  }

  return {
    props: { model, builderContent },
  };
};

export default function Page({
  model,
  builderContent,
}: {
  model: string;
  builderContent: any;
}) {
  return <BuilderComponent model={model} content={builderContent} />;
}
