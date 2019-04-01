
const fs = require('fs');
const csv = require('csvtojson');
const formatXml = require('xml-formatter');
const langs = ['en','de','es','fr','nl','it'];
const formatXmlOptions = { indentation:'  ', collapseContent:false };

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
        fs.writeFileSync(`./sitemaps/sitemap-${lang}.xml`,formatXml(body.trim(),formatXmlOptions),handleErr);
    });
}

function searchCsv(){
    return new Promise((resolve,reject) => {
        fs.readdir('./csv/',(err, files) => {            
            if(err) reject(Error("Issue finding the directory. Make sure it still exists"))
            const csvArr = [];
            files.forEach(file => {
                if(file.includes('.csv') && csvArr.length === 0){
                    csvArr.push(file);
                }
            });
            const oneCsv = csvArr[0] || "";
            if(oneCsv){
                resolve(oneCsv);
            } else {
                reject(Error("No CSV files at all. You should probably add one 😬"));
            }
        });
    });
}

searchCsv()
.then(filePath => {
    csv()
    .fromFile(`./csv/${filePath}`)
    .then(obj => buildXml(obj));
}).catch(e => {
    console.log(e.message);
});

// csv()
// .fromFile(csvFile)
// .then(obj => buildXml(obj));



