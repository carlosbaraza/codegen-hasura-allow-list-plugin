"use strict";
// build the plugin again if changed
// tsc codegen-hasura-allow-list-plugin.ts
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var yaml = require("js-yaml");
var graphql = require("graphql");
var plugin = function (schema, documents, config, info) {
    var queries = documents
        .map(function (doc) {
        var _a, _b;
        var operations = (((_a = doc.document) === null || _a === void 0 ? void 0 : _a.definitions.filter(function (d) { return d.kind === 'OperationDefinition'; })) || []);
        var notOperations = ((_b = doc.document) === null || _b === void 0 ? void 0 : _b.definitions.filter(function (d) { return d.kind !== 'OperationDefinition'; })) || [];
        return operations
            .map(function (operation) {
            if (!operation || !operation.name)
                return null;
            return {
                name: operation.name.value,
                query: graphql.print(operation) +
                    '\n\n' +
                    notOperations.map(function (v) { return graphql.print(v); }).join('\n\n')
            };
        })
            .filter(function (x) { return x; });
    })
        .reduce(function (acc, ops) { return __spreadArray(__spreadArray([], acc, true), ops, true); }, []);
    var output = [
        {
            name: 'allowed-queries',
            definition: {
                queries: queries
            }
        },
    ];
    return yaml.dump(output);
};
module.exports = {
    plugin: plugin
};
