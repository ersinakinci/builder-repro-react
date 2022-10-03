import { builder } from '@builder.io/react';
import { GetContentOptions } from '@builder.io/sdk';

export type CommonBuilderContentProps = {
  header: any;
  footer: any;
  drawerLeft: any;
  drawerRight: any;
  projectsList: any;
};

const camelize = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase());

export async function resolveBuilderContent<T>(
  ...args: {
    modelName: string;
    key?: string;
    options?: GetContentOptions & {
      req?: any;
      res?: any;
      apiKey?: string | undefined;
      authToken?: string | undefined;
    };
  }[]
): Promise<CommonBuilderContentProps & T> {
  const promises = args.map(({ modelName, options }) =>
    builder.get(modelName, options).toPromise()
  );

  const contents = await Promise.all([
    ...promises,
    builder.get('header', { options: { noTargeting: true } }).toPromise(),
    builder.get('footer', { options: { noTargeting: true } }).toPromise(),
    builder.getAll('project', {
      fields: 'data.url,data.category,data.title',
      options: { noTargeting: true },
      limit: 1000,
    }),
  ]);

  const props = contents.reduce((memo, content, i) => {
    if (i < args.length) {
      const { key, modelName } = args[i];

      memo[key || camelize(modelName)] = content || null;
    } else {
      const offsetIndex = i - args.length;
      // Identical order as the promises for common content above
      const key = ['header', 'footer', 'projectsList'][offsetIndex];

      memo[key] = content || null;
    }

    return memo;
  }, {});

  return props;
}
