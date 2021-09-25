// build the plugin again if changed
// tsc codegen-hasura-allow-list-plugin.ts

import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { OperationDefinitionNode } from 'graphql';
import * as yaml from 'js-yaml';
import * as graphql from 'graphql';

const plugin: PluginFunction = (schema, documents, config, info) => {
  const queries = documents
    .map((doc) => {
      const operations = (doc.document?.definitions.filter(
        (d) => d.kind === 'OperationDefinition'
      ) || []) as OperationDefinitionNode[];

      const notOperations =
        doc.document?.definitions.filter(
          (d) => d.kind !== 'OperationDefinition'
        ) || [];

      return operations
        .map((operation) => {
          if (!operation || !operation.name) return null;

          return {
            name: operation.name.value,
            query:
              graphql.print(operation) +
              '\n\n' +
              notOperations.map((v) => graphql.print(v)).join('\n\n'),
          };
        })
        .filter((x) => x);
    })
    .reduce((acc, ops) => [...acc, ...ops], []);

  const output = [
    {
      name: 'allowed-queries',
      definition: {
        queries,
      },
    },
  ];

  return yaml.dump(output);
};

module.exports = {
  plugin,
};
