import { builder } from '@builder.io/react';

if (process.env.NEXT_PUBLIC_BUILDER_API_KEY)
  builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);
