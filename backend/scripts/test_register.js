const http = require('http');

const timestamp = Date.now();
const data = JSON.stringify({
    username: `user_${timestamp}`,
    email: `user_${timestamp}@example.com`,
    password: 'password123',
    full_name: 'Test Node User'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
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
