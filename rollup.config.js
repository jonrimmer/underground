import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'out/underground.js',
  output: {
    file: 'build/underground.js',
    format: 'iife'
  },
  plugins: [resolve()]
};
