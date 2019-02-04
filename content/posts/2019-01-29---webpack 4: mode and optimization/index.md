Webpack4增加了一个`mode`配置选项,但是它不是必选的，省略会报出警告⚠️。`mode`可以设置成`development`和`production`。

设置成`development`默认是集中于最佳的开发体验：
- 浏览器调试工具
- 快速增量编译，加快开发
- 运行时提供有用的错误信息



## webpack 4: mode and optimization

### webpack adds a mode option. What does that mean?

![](https://cdn-images-1.medium.com/max/8920/1*RAnStHKrhy6OhxC1DPCmmw.jpeg)

So webpack 4 added a mode option. ***And it’s required.*** (*Actually it’s not required but it will warn you if you omit it.)*

webpack 4 now ships with **two sets of defaults**. development and production. These are the two values to which mode can be set to.

The development defaults will give you the best* development experience focusing on:

* Tooling for in browser debugging

* Fast incremental compilation for a fast development cycle

* Useful error messages at runtime

(* Actually this depends on your use case, we try to cover the most common one here)

While the production defaults will give you a set of defaults useful for deploying your application, focusing on:

* Small output size

* Fast code at runtime

* Omitting development-only code

* Not exposing source code or file paths

* Easy to use output assets

The last bullet point is pretty important. It basically means production gives you well optimized assets, but not perfectly optimized assets. There are additional optimizations possible, but they would make the result more difficult to use. These optimizations are intentionally omitted because here we value getting started experience higher than perfect optimization. Most of the additional optimization are only relevant for large applications anyway.

With the new mode option we tried to reduce the required configuration for a useful build. We tried to cover the common use cases with these defaults.

But from our experience we also know that defaults are not for everyone. Each team has different needs, sometimes because of legacy stuff, sometimes because of personal preferences, sometimes because of special applications or sometimes because they don’t believe common best practices. Many people do want to change defaults to adapt to own use cases. We got you covered. Adding mode doesn’t mean that we remove configuration. Everything is still configurable. We actually made most of the internal optimization steps configurable (you can now disable them).

mode is implemented by setting default values to configuration options. No special behavior is done by mode which isn’t possible via other configuration option.

The next part will go deeper into the configuration options affected by mode and other added options:

### devtool

Defaults to eval in development mode. Elsewise no devtool is used.

The eval devtool doesn’t give the best quality, but has a very good performance. That’s the trade-off we choose here. Take a look at the documentation for more options which result in better quality SourceMaps.

📉📉📉 slow, bundle size

📈📈📈 improved debugging

### cache

Enabled in development mode. Elsewise disabled.

Caches modules and avoid rebuilding them when unchanged.

In memory caching is only useful in watch mode and we assume you are using watch mode in development. The memory footprint is lower without caching.

📉 memory footprint

📈📈📈 faster incremental builds

### module.unsafeCache

Enabled when cache is enabled. Elsewise disabled.

Caches resolved dependencies to avoid re-resolving them.

📉 memory footprint, cache entry could be wrong

📈📈 faster incremental builds

### output.pathinfo

Enabled in development mode. Elsewise disabled.

These extra comment are useful for debugging, especially with the eval devtool.

📉 bundle size, leak path info

📈 improved readability of generated code

### performance

Enabled in production mode. Elsewise disabled.

The size limits are only useful on minimized assets and it has a performance cost. So it’s only enabled in production mode.

📉 algorithmic cost

📈 warning about bundle size

### optimization.removeAvailableModules

Always enabled.

Modules are removed from chunks when they are already available in all parent chunk groups. This reduces asset size. Smaller assets also result in faster builds since less code generation has to be performed.

📉📉 algorithmic cost

📈📈📈 bundle size

### optimization.removeEmptyChunks

Always enabled.

Empty chunks are removed. This reduces load in filesystem and results in faster builds.

📉 algorithmic cost

📈📈📈 fewer requests

### optimization.mergeDuplicateChunks

Always enabled.

Equal chunks are merged. This results in less code generation and faster builds.

📉 algorithmic cost

📈📈📈 fewer requests and downloads

### optimization.flagIncludedChunks

Enabled in production mode. Elsewise disabled.

Chunks which are subsets of other chunks are determined and flagged in a way that subsets don’t have to be loaded when the bigger chunk has been loaded.

📉 algorithmic cost

📈📈 fewer requests and downloads

### optimization.occurrenceOrder

Enabled in production mode. Elsewise disabled.

Give more often used ids smaller (shorter) values.

📉 algorithmic cost

📈 bundle size

### optimization.providedExports

Always enabled.

Determine exports for each module when possible. This information is used by other optimizations or code generation. I. e. to generate more efficient code for export * from.

📉 algorithmic cost

📈 bundle size, requirement for other optimizations

### optimization.usedExports

Enabled in production mode. Elsewise disabled.

Determine used exports for each module. This depends on optimization.providedExports. This information is used by other optimizations or code generation. I. e. exports are not generated for unused exports, export names are mangled to single char identifiers when all usages are compatible. DCE in minimizers will benefit from this and can remove unused exports.

📉📉 algorithmic cost

📈📈 bundle size

### optimization.sideEffects

Enabled in production mode. Elsewise disabled.

Recognise the sideEffects flag in package.json or rules to eliminate modules. This depends on optimization.providedExports and optimization.usedExports. These dependencies have a cost, but eliminating modules has positive impact on performance because of less code generation. It depends on your codebase. Try it for possible performance wins.

📉 algorithmic cost

📈📈📈 bundle size, less code generation

### optimization.concatenateModules

Enabled in production mode. Elsewise disabled.

Tries to find segments of the module graph which can be safely concatenated into a single module. Depends on optimization.providedExports and optimization.usedExports.

📉📉📉 additional parsing, scope-analysis and identifier renaming (performance)

📈📈📈 runtime performance and bundle size

### optimization.splitChunks

Always enabled.

Finds modules which are shared between chunk and splits them into separate chunks to reduce duplication or separate vendor modules from application modules.

📉 algorithmic cost, additional requests

📈📈📈 less code generation, better caching, less download

### optimization.runtimeChunk

Always enabled.

Create a separate chunk for the webpack runtime code and chunk manifest. This chunk should be inlined into the HTML

📉 bigger HTML file

📈 better caching

### optimization.noEmitOnErrors

Enabled in production mode. Elsewise disabled.

Don’t write output assets when compilation errors.

📉 unable to use working part of the application

📈 no broken bundles

### optimization.namedModules

Enabled in development mode. Elsewise disabled.

Instead of numeric ids, give modules useful names.

📉 bundle size

📈 better error reporting and debugging

### optimization.namedChunks

Enabled in development mode. Elsewise disabled.

Instead of numeric ids, give chunks useful names.

📉 bundle size

📈 better error reporting and debugging

### optimization.nodeEnv

Defaults to the mode value: development or production.

Defines the process.env.NODE_ENV constant to a compile-time-constant value. This allows to remove development only code from code.

📉 Code in development is different from code in production

📈📈 bundle size, runtime performance

### optimization.minimize

Enabled in production mode. Elsewise disabled.

Use the minimizer (optimization.minimizer, by default uglify-js) to minimize output assets.

📉📉📉 slow

📈📈📈 bundle size

### optimization.portableRecords

Enabled with in-file records are used. Elsewise disabled.

Identifiers used in records are relative to context directory.

📉 slow

📈 records are independent of directory
