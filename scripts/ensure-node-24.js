const major = Number(process.versions.node.split('.')[0]);

if (major !== 24) {
  console.error(`This project must run on Node.js 24.x. Current version: ${process.version}`);
  process.exit(1);
}
