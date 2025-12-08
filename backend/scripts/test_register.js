method: 'POST',
    headers: {
    'Content-Type': 'application/json',
        'Content-Length': data.length
}
};

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('Body:', body));
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
