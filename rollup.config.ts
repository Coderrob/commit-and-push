/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { builtinModules } from 'node:module';

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'es',
      esModule: true,
      sourcemap: true,
      inlineDynamicImports: true,
      generatedCode: {
        constBindings: true,
        objectShorthand: true,
        arrowFunctions: true
      }
    }
  ],
  external: [
    // Node.js built-ins
    ...builtinModules,
    // @actions packages
    '@actions/core',
    '@actions/exec',
    '@actions/http-client',
    // Node.js prefixed modules
    'node:fs',
    'node:path',
    'node:crypto',
    'node:os',
    'node:util',
    'node:events',
    'node:stream',
    'node:buffer',
    'node:querystring',
    'node:http',
    'node:https',
    'node:net',
    'node:tls',
    'node:assert',
    'node:child_process',
    'node:timers',
    'node:string_decoder',
    'node:diagnostics_channel',
    'node:worker_threads',
    'node:perf_hooks',
    'node:async_hooks',
    'node:console',
    'node:url',
    'node:zlib'
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      sourceMap: true
    }),
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ['node']
    }),
    commonjs({
      include: /node_modules/,
      esmExternals: true
    }),
    terser({
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      },
      sourceMap: true
    })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  }
};

export default config;
