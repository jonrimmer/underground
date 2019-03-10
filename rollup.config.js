import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/ui/index.ts',
  output: {
    file: 'build/underground.js',
    format: 'iife',
    name: 'underground',
    sourcemap: true
  },
  watch: {
    include: 'src/**'
  },
  plugins: [typescript(), resolve(), sourcemaps()]
};
