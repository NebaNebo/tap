// Load environment variables from .env file
require('dotenv').config();

const axios = require('axios');

let authToken = null;

// Function to submit taps
async function submitTaps() {
    if (!authToken) {
        console.error('Error: No auth token available');
        return;
    }

    try {
        const url = "https://api.tapswap.ai/api/player/submit_taps";
        const payload = {
            taps: 100,
            time: new Date().getTime()
        };

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'X-App': 'tapswap_server',
                'X-Cv': '600'
            }
        };

        const response = await axios.post(url, payload, options);
        console.log(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}


// Function to login and retrieve auth token
async function loginBot() {
    try {
        const url = 'https://api.tapswap.ai/api/account/login';
        const payload = {
            'bot_key': 'app_bot_0',
            'init_data': 'query_id=AAEl6gN2AAAAACXqA3bBNynO&user=%7B%22id%22%3A1979968037%2C%22first_name%22%3A%22Neba%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Mr_NebaNebo%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1716312729&hash=e5a161f0484cbe7afe30f400a0a3a99318c512827ca194f7db852dc6236414ec',
            'referrer': ''
        };

        const options = {
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Origin': 'https://app.tapswap.club',
                'Referer': 'https://app.tapswap.club/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/125.0.0.0',
                'X-App': 'tapswap_server',
                'X-Cv': '600'
            }
        };

        const response = await axios.post(url, payload, options);
        console.log('Full response:', response.data);
        authToken = response.data.access_token;
        console.log('Token updated:', authToken);

        // After successful login, start polling
        pollSubmitTaps();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to poll submit taps
function pollSubmitTaps() {
    const maxExecutionTime = 5.5 * 60 * 1000; // 5.5 minutes in milliseconds
    const startTime = Date.now();

    const interval = setInterval(() => {
        if (Date.now() - startTime < maxExecutionTime) {
            submitTaps();
        } else {
            clearInterval(interval);
        }
    }, 1000); // Sleep for 1 second
}

// Initial login call
loginBot();