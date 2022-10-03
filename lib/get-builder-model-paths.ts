import { builder } from '@builder.io/react';

const getBuilderModelPaths = async (model: string) => {
  const items = await builder.getAll(model, {
    fields: 'data.url', // only request the `data.url` field
    options: { noTargeting: true },
    limit: 0,
  });

  return items.map((item) => `${item.data?.url}`);
};

export { getBuilderModelPaths };
