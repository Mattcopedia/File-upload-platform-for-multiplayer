const path = require('path');

const buildEslintCommand = (filenames) => {
  // Ignore only pdf.worker.min.js
  const filtered = filenames.filter((f) => !f.includes('pdf.worker.min.js'));

  if (filtered.length === 0) {
    return 'echo "No valid files to lint"';
  }

  return `next lint --fix --file ${filtered
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
