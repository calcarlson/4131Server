const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

http.createServer(function(req, res) {

    var q = url.parse(req.url, true);

    var filename = "." + q.pathname;
    switch (req.method) {
        case 'GET':
            if (req.url === '/') {
                indexPage(req, res);
            } else if (req.url === '/index.html') {
                indexPage(req, res);
            } else if (req.url === '/contact.html') {
                contactPage(req, res);
            } else if (req.url == '/addContact.html') {
                addContactPage(req, res);
            } else if (req.url == '/stock.html') {
                stockPage(req, res);
            } else if (req.url == '/getContact') {
                getContact(req, res);
            } else if (req.url == '/getStock') {
                getStock(req, res);
                console.log('made a stock get request');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            break;
        case 'POST':
            if (req.url == '/postContactEntry') {
                var reqBody = '';
                //server starts receiving data
                req.on('data', function(data) {
                    reqBody += data;
                });
                req.on('end', function() {
                    jsonContactEdit(req, res, reqBody);
                });

            }
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("405 Not Supported");


    }
}).listen(9001);
console.log('Server started on port 9001');


//returns the index page
function indexPage(req, res) {
    fs.readFile('client/index.html', function(err, html) {
        if (err) {
            throw err;
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html);
        res.end();
    });
}

//returns the contact page
function contactPage(req, res) {
    fs.readFile('client/contact.html', function(err, html) {
        if (err) {
            throw err;
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html);
        res.end();
    });
}

//returns the addcontact page
function addContactPage(req, res) {
    fs.readFile('client/addContact.html', function(err, html) {
        if (err) {
            throw err;
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html);
        res.end();
    });
}

//returns the stock page
function stockPage(req, res) {
    fs.readFile('client/stock.html', function(err, html) {
        if (err) {
            throw err;
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html);
        res.end();
    });
}

//function to listen on an endpoint for the GET request from contact.html page
function getContact(req, res) {
    fs.readFile('contact.json', function(err, content) {
        if (err) {
            throw err;
        }
        parseJson = JSON.parse(content);
        var response = { res: parseJson };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(response));
        res.end();
    });
}

//function to add a new entry to the contacts json file 
function jsonContactEdit(req, res, reqBody) {
    newEntry = qs.parse(reqBody);
    fs.readFile('contact.json', function(err, content) {
        if (err) {
            throw err;
        }
        entry = JSON.parse(content);
        entry.contact.push(newEntry);
        fs.writeFile('contact.json', JSON.stringify(entry, null, 2), (err) => {
            if (err) {
                throw err;
            } else {
                res.statusCode = 302;
                res.setHeader('Location', '/contact.html');
                res.end();
            }
        });

    });
}

//function to return the json from the alphaadvantage API
function getStock(req, res) {
    fs.readFile('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=D1AGVBW5CBXF5M8D', function(err, content) {
        if (err) {
            throw err;
        }
        console.log("called stock API");
        parseJson = JSON.parse(content);
        var response = { res: parseJson };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(response));
        res.end();
    });
}