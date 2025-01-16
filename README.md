# graphql-jit-issue

This PR shows an issue with `@envelop/graphql-jit` where it doesn't work with `Temporal.PlainDate`.

When `jit` is enabled, the `input.date` argument is not a `Temporal.PlainDate` but a `string`. When `jit` is disabled,
the `input.date` argument is a `Temporal.PlainDate`.

## How to run

```bash
git clone https://github.com/blimmer/graphql-jit-issue.git
cd graphql-jit-issue
yarn
yarn start
```

Open http://localhost:4000/graphql and try to run the `testMutation` mutation.

```graphql
mutation {
  testMutation(input: { date: "2018-01-01" }) {
    date
  }
}
```

When `jit` is enabled, the `input.date` argument is a `string` and the mutation fails.

```shell
ERR Error: Input should be a Temporal.PlainDate
    at Object.testMutation (/Users/blimmer/code/graphql-jit-issue/src/server.ts:36:17)
    at Array.testMutationMutationtestMutationResolverMutation (eval at compileQuery (/Users/blimmer/code/graphql-jit-issue/node_modules/graphql-jit/dist/execution.js:120:9), <anonymous>:116:39)
    at query (eval at compileQuery (/Users/blimmer/code/graphql-jit-issue/node_modules/graphql-jit/dist/execution.js:120:9), <anonymous>:46:25)
    at query (/Users/blimmer/code/graphql-jit-issue/node_modules/graphql-jit/src/execution.ts:389:27)
    at ValueOrPromise.then.result.stringify (file:///Users/blimmer/code/graphql-jit-issue/node_modules/@envelop/graphql-jit/esm/index.js:46:41)
    at new ValueOrPromise (/Users/blimmer/code/graphql-jit-issue/node_modules/value-or-promise/src/ValueOrPromise.ts:35:15)
    at jitExecutor (file:///Users/blimmer/code/graphql-jit-issue/node_modules/@envelop/graphql-jit/esm/index.js:46:16)
    at file:///Users/blimmer/code/graphql-jit-issue/node_modules/@envelop/core/esm/utils.js:83:61
    at file:///Users/blimmer/code/graphql-jit-issue/node_modules/@envelop/core/esm/orchestrator.js:386:33
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  locations: [ { line: 1, column: 10 } ],
  path: [ 'testMutation' ]
}
```

When `jit` is disabled, the `input.date` argument is a `Temporal.PlainDate` and the mutation succeeds. Comment out
the `useGraphQlJit()` plugin to see the resolver working properly.

```json
{
  "data": {
    "testMutation": {
      "date": "2018-01-01"
    }
  }
}
```

## Passing as a Variable

If you pass the date as a variable, it works even with `jit` enabled.

```graphql
mutation testMutation($input: TestMutationInput!) {
  testMutation(input: $input) {
    date
  }
}
```

```json
{
  "input": {
    "date": "2018-01-01"
  }
}
```
