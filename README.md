<div align="center">

# WedPlan

### A wedding planning platform. Find wedding vendors, compare their services and send booking requests.

WedPlan connects couples with wedding vendors. Customers browse photographers, venues, florists, caterers, makeup artists and fashion houses, then send a booking request for their date. Vendors publish services, answer requests and can upgrade to Premium. Admins review every listing, manage users and see platform payments.

**Live Site:** [wedplan-febappi.vercel.app](https://wedplan-febappi.vercel.app)

**Client repository:** [github.com/febappi/WedPlan](https://github.com/febappi/WedPlan)
**Server repository:** [github.com/febappi/WedPlan-Server](https://github.com/febappi/WedPlan-Server)

<br>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-1-000000?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## Technologies I Used

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui (Base UI)
- Better Auth with the MongoDB adapter and the JWT plugin (email and password, Google)
- Stripe Checkout for the Premium subscription (test mode)
- ImgBB for profile and service photos
- Framer Motion for home page animations
- Lucide icons
- Express.js + MongoDB backend ([WedPlan Server](https://github.com/febappi/WedPlan-Server))

## Features

1. **Three roles with their own dashboards:** Customer, Vendor and Admin. Each dashboard has a sidebar, statistics cards and pages for its role. Opening another role's dashboard by changing the URL sends you back to your own, and the server checks the role again on every protected request.

2. **Sign up and sign in:** Email and password or Google. Sign up asks for name, email, password (6 characters or more with an uppercase and a lowercase letter), an optional profile photo uploaded to ImgBB, and the account role (Customer or Vendor). Admin accounts cannot be created from the website. After signing in, each user goes to the dashboard of their role.

3. **Browse wedding services:** The public Browse Services page shows approved and available services with search (every word is matched against the name, description, city, category and business name), category filter, location filter, price sorting (low to high and high to low), pagination, loading skeletons and an empty state.

4. **Service details and booking requests:** Signed-in customers open a service, see its photo gallery, price, location and vendor, and send a booking request with the event date, location and a message. Vendors and admins cannot book, nobody can book their own service, and a second open request for the same service and date is refused.

5. **Vendor tools:** Add, edit and delete services with up to 5 photos, see each service's approval status, switch a service on or off, and accept or reject booking requests. A request can only be answered once.

6. **Premium subscription with Stripe:** Free vendors can keep 3 active services. Premium ($19 a month, test mode) removes the limit and adds a Premium vendor badge. Premium is switched on only after Stripe's signed webhook confirms the payment, never by the success page. Vendors can cancel and keep Premium until the paid month ends; after that only their three newest services stay active.

7. **Customer bookings:** Customers see every request they sent with its status, open the details, and cancel requests that are still pending.

8. **Admin tools:** Manage users (search, filter by role, view details, block and unblock; blocked users are signed out and cannot use the platform), manage services (approve, reject, move back to pending, delete) and view all Stripe transactions. Payment records are read only.

9. **Responsive and careful UI:** Works on phone, tablet and desktop. Toasts show every success and error, forms show field errors, pages have loading, empty and error states, and unknown routes show a custom 404 page.

## Test Accounts and Payments

- Admin login details are sent with the assignment submission.
- Create your own customer and vendor accounts from the Sign Up page.
- For Premium, use Stripe's test card `4242 4242 4242 4242` with any future expiry date and any CVC.

## Installation and Running Locally

The [WedPlan Server](https://github.com/febappi/WedPlan-Server) must be running first.

```bash
git clone https://github.com/febappi/WedPlan.git
cd WedPlan
npm install
npm run dev
```

Create a `.env.local` file in the project root before running:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=any_long_random_string
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=wedplan
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMGBB_API_KEY=your_imgbb_api_key

# used once by npm run create-admin
ADMIN_NAME=WedPlan Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_strong_password
```

Then open [http://localhost:3000](http://localhost:3000).

- `MONGODB_URI` and `DB_NAME` must be the same as the server's, because Better Auth and the server share the `users` collection.
- In Google Cloud Console, add `http://localhost:3000/api/auth/callback/google` (and your live URL) as an authorised redirect URI.

### Create the admin account

Admins cannot sign up on the website. Run this once after filling in `ADMIN_EMAIL` and `ADMIN_PASSWORD`:

```bash
npm run create-admin
```

It creates the account, or turns an existing account into an admin.
