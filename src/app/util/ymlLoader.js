const YAML = require('yamljs');
const path = require('path');
const resourcesData = YAML.load(path.join(__dirname, '..', 'routes', 'data', 'slash', 'resources', 'resourcesData.yml'));

module.exports = { resourcesData };
