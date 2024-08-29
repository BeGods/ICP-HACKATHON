import requests
import random
import string

url = "http://localhost:3000/api/v1/test/auth"

# Existing users to simulate the referral system
existing_users = [
    {"telegramId": 1126065333, "telegramUsername": "twaykar8"},
    # Add more existing users if needed
]

# Function to generate random Telegram ID and Username
def generate_user(existing_users):
    telegram_id = random.randint(100000, 999999)
    telegram_username = ''.join(random.choices(string.ascii_lowercase, k=5))
    is_premium = random.choice([True, False])
    
    # Pick a random existing user to act as the referrer
    referrer = random.choice(existing_users)
    referral_code = f"FDG{referrer['telegramId']}"
    
    user_data = {
        "telegramId": telegram_id,
        "telegramUsername": telegram_username,
        "isPremium": is_premium,
        "referralCode": referral_code
    }
    
    return user_data

# Generate and send 50 POST requests
for _ in range(200):
    new_user = generate_user(existing_users)
    response = requests.post(url, json=new_user)
    
    if response.status_code == 200 or 201:
        print(f"Successfully created user: {new_user['telegramUsername']} with referral code {new_user['referralCode']}")
    else:
        print(f"Failed to create user: {new_user['telegramUsername']}. Status code: {response.status_code}")

    # Add the newly created user to the list of existing users
    existing_users.append({"telegramId": new_user['telegramId'], "telegramUsername": new_user['telegramUsername']})
