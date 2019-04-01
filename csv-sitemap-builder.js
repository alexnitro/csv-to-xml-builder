
const fs = require('fs');
const csv = require('csvtojson');
const formatXml = require('xml-formatter');
const csvFile = './sitemap-csv/full-site.csv';
const langs = ['en','de','es','fr','nl','it'];
const formatXmlOptions = {indentation:'  ',collapseContent:false};

function handleErr(err){
    if(err)console.log(err);
    else console.log('File done');
}
function buildXml(obj){
    langs.forEach(lang => {
        const xmlns = 'http://www.sitemaps.org/schemas/sitemap/0.9';
        const xhtml = "http://www.w3.org/1999/xhtml";
        let body = `<?xml version="1.0" encoding="utf-8"?><urlset xmlns="${xmlns}" xmlns:xhtml="${xhtml}">`;
        obj.forEach(page => {   
            body += `
            <url><loc>https://www.gonitro.com${lang === 'en' ? '' : `/${lang}`}${page.url}</loc><lastmod>${page.lastmod}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>`
        });
        body += `</urlset>`;
        console.log(body);
        fs.writeFileSync(`./sitemap-csv/sitemap-${lang}.xml`,formatXml(body.trim(),formatXmlOptions),handleErr);
    });
}

csv()
.fromFile(csvFile)
.then(obj => buildXml(obj));



