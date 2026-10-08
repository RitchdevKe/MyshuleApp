const fetch = require("node-fetch");
fetch("http://localhost:3000/api/cron/generate-insights")
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);