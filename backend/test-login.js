const User = require('./src/models/User');
require('dotenv').config();

async function testLogin() {
    console.log('Testing login for admin...');
    try {
        const user = await User.findByUsername('admin');
        if (!user) {
            console.log('User not found!');
            return;
        }
        console.log('User found:', user.username);
        console.log('Stored Hash:', user.password_hash);

        const isValid = await User.verifyPassword(user, 'password123');
        console.log('Password valid:', isValid);
    } catch (error) {
        console.error('Error:', error);
    }
}

testLogin();
