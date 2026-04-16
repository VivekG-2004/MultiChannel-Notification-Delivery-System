# 🔔 Multi-Channel Notification Delivery System

A B2B notification API service supporting Email, SMS, In-App, and Webhook channels
with retry engine, dead letter queue, and delivery analytics.

---

## Tech Stack

- **Backend** — Java 17, Spring Boot 3, MySQL 8, Flyway, Spring Security, JWT
- **Admin Panel** — React, Vite, Tailwind CSS
- **Client Portal** — React, Vite, Tailwind CSS

---

## Project Structure
multichannel-notification-delivery-system/
├── notification-backend/     → Spring Boot backend
├── notification-frontend/    → Admin panel (React)
└── notification-client-ui/   → Client portal (React)

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Download |
|------|---------|----------|
| Java | 17 | https://www.oracle.com/java/technologies/downloads/#java17 |
| Maven | 3.8+ | https://maven.apache.org/download.cgi |
| MySQL | 8.0 | https://dev.mysql.com/downloads/installer/ |
| Node.js | 18+ | https://nodejs.org |
| Git | Latest | https://git-scm.com |

---

## Step 1 — Clone the Repository

Open terminal and run:

```bash
git clone https://github.com/VivekG-2004/MultiChannel-Notification-Delivery-System.git
```

Then open the cloned folder:

```bash
cd MultiChannel-Notification-Delivery-System
```

---

## Step 2 — Set Up MySQL Database

Open MySQL Workbench or any MySQL client and run:

```sql
CREATE DATABASE notification_platform;
```

That is it. Do not create any tables manually.
Flyway will automatically create all 7 tables when the backend starts for the first time.

---

## Step 3 — Configure Backend

### For IntelliJ Users

1. Open IntelliJ IDEA
2. Click `File → Open`
3. Select the `notification-backend` folder
4. Wait for Maven to download all dependencies (this may take a few minutes)

### For Eclipse Users

1. Open Eclipse
2. Click `File → Import`
3. Select `Maven → Existing Maven Projects`
4. Click `Browse` and select the `notification-backend` folder
5. Click `Finish`
6. Wait for Maven to download all dependencies

### Set Up application.properties

Go to:
notification-backend/src/main/resources/

You will see `application.properties.example` file.

**Copy it and rename the copy to `application.properties`**

On Windows:
```bash
cd notification-backend/src/main/resources
copy application.properties.example application.properties
```

On Mac/Linux:
```bash
cd notification-backend/src/main/resources
cp application.properties.example application.properties
```

Now open `application.properties` and fill in your values:

```properties
# ───────────────────────────────
# Database Configuration
# ───────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/notification_platform
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# ───────────────────────────────
# Flyway
# ───────────────────────────────
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# ───────────────────────────────
# JWT Configuration
# ───────────────────────────────
# Put any long random string here — minimum 32 characters
app.jwt.secret=put-any-long-random-string-here-minimum-32-characters
app.jwt.expiration=86400000

# ───────────────────────────────
# Admin Credentials
# ───────────────────────────────
# These are the credentials to login to the admin panel
app.admin.username=admin
app.admin.password=admin123

# ───────────────────────────────
# Gmail SMTP Configuration
# ───────────────────────────────
# You need a Gmail account with 2FA enabled
# Generate App Password at:
# Google Account → Security → 2-Step Verification → App Passwords
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# ───────────────────────────────
# SMS Configuration (Optional)
# ───────────────────────────────
# Only needed if you want to test SMS channel
# Get API key from https://www.fast2sms.com
app.sms.api.key=YOUR_FAST2SMS_API_KEY

# ───────────────────────────────
# Plan Limit
# ───────────────────────────────
app.plan.free.limit=1000

# ───────────────────────────────
# Server Port
# ───────────────────────────────
server.port=8080
```

---

## Step 4 — Run the Backend

### IntelliJ Users

1. Open the project in IntelliJ
2. Find `NotificationPlatformApplication.java` in the project explorer
3. Right click on it
4. Click `Run NotificationPlatformApplication`

### Eclipse Users

1. Open the project in Eclipse
2. Right click on the project
3. Click `Run As → Spring Boot App`

### Terminal Users

```bash
cd notification-backend
./mvnw spring-boot:run
```

On Windows if above does not work:
```bash
mvn spring-boot:run
```

### How to Know Backend is Running

Wait until you see this in the console:
Started NotificationPlatformApplication in X.XXX seconds



---

## Step 5 — Run Admin Frontend

Open a **new terminal** and run:

```bash
cd notification-frontend
npm install
npm run dev
```

Wait until you see:
VITE ready in XXX ms
➜  Local:   http://localhost:5173/

Open browser and go to:
http://localhost:5173

Login with:
Username: admin
Password: admin123

---

## Step 6 — Run Client Frontend

Open **another new terminal** and run:

```bash
cd notification-client-ui
npm install
npm run dev
```

Wait until you see:
VITE ready in XXX ms
➜  Local:   http://localhost:5174/

Open browser and go to:
http://localhost:5174

---

## How to Use the System

### Admin Flow

Go to http://localhost:5173
Login with admin credentials (admin / admin123)
Go to Clients page
Click Register Client button
Fill company name and email
Copy the API key shown — share it with the client
Monitor all jobs, DLQ, and analytics from the dashboard


### Client Flow

Go to http://localhost:5174
Click Register
Fill your company name and email
Copy your API key shown after registration
Enter your API key to access the client dashboard
Send notifications, manage templates, view history


---

## Running All Three Together

You need **3 terminals running at the same time**:
Terminal 1 → Backend   → http://localhost:8080
Terminal 2 → Admin UI  → http://localhost:5173
Terminal 3 → Client UI → http://localhost:5174

---

## Common Issues and Fixes

### Backend not starting — Port 8080 already in use

**Windows:**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -i :8080
kill -9 <PID_NUMBER>
```

### MySQL connection error

- Make sure MySQL service is running
- Open MySQL Workbench and verify you can connect
- Check `spring.datasource.password` in `application.properties`

### Frontend showing 403 Forbidden

- Make sure backend is running first
- Check that you are logged in with correct credentials
- Clear browser localStorage and login again

### Frontend on wrong port (5174 instead of 5173)

This happens when port 5173 is already in use. Vite automatically picks 5174.

Fix — open `notification-backend/src/main/java/.../config/SecurityConfig.java` and update:

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:5174"
));
```

Restart the backend.

### Gmail not sending emails

1. Make sure 2FA is enabled on your Gmail account
2. Generate an App Password:
Google Account → Security → 2-Step Verification → App Passwords
→ Select app: Mail → Select device: Windows Computer → Generate
3. Use that 16 character password in `spring.mail.password`
4. Do not use your regular Gmail password

### node_modules error in frontend

```bash
rm -rf node_modules
npm install
npm run dev
```

---

## API Documentation


### Quick API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | None | Admin login |
| POST | /api/clients/register | None | Register as client |
| GET | /api/admin/clients | JWT | Get all clients |
| PUT | /api/admin/clients/{id}/block | JWT | Block a client |
| POST | /api/notify | API Key | Send notification |
| POST | /api/notify/schedule | API Key | Schedule notification |
| GET | /api/notify/history | API Key | Notification history |
| GET | /api/admin/jobs | JWT | All jobs |
| GET | /api/admin/dlq | JWT | Dead letter queue |
| POST | /api/admin/dlq/{id}/replay | JWT | Replay failed job |
| DELETE | /api/admin/dlq/{id} | JWT | Discard failed job |
| GET | /api/analytics/summary | JWT | Analytics summary |
| GET | /api/inbox/{userRef} | None | In-app notifications |

---

## Database Schema

7 tables created automatically by Flyway:
clients              → registered client companies
templates            → notification templates with placeholders
notification_jobs    → all notification jobs and their status
dead_letter_jobs     → jobs that exhausted all retries
delivery_logs        → individual delivery attempt logs
in_app_notifications → in-app notification inbox
client_usage         → per client usage tracking