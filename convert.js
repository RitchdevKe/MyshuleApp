const fs = require('fs');
const mammoth = require('mammoth');
const TurndownService = require('turndown');

const file = 'C:\\Users\\USER\\Downloads\\Siscom_Strategic_Business_Technology_Marketing_Plan.docx';

mammoth.convertToHtml({path: file})
    .then(function(result){
        const html = result.value;
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(html);
        fs.writeFileSync('business_plan.md', markdown);
        console.log("Successfully converted to business_plan.md");
    })
    .catch(function(err) {
        console.error(err);
    });
