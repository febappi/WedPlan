<div align="center">

# WedPlan

### Find wedding vendors, compare their services and send booking requests, all in one place.

WedPlan connects couples with wedding vendors. Customers browse photographers, venues, florists, caterers, makeup artists and fashion houses, then send a booking request for their date. Vendors publish services, answer requests and can upgrade to Premium. Admins review every listing, manage users and see platform payments.

**Live Site:** [wedplan-febappi.vercel.app](https://wedplan-febappi.vercel.app) &nbsp;·&nbsp; **Live API:** [wedplan-server-api.vercel.app](https://wedplan-server-api.vercel.app)

**Client Repository:** [github.com/febappi/WedPlan](https://github.com/febappi/WedPlan) &nbsp;·&nbsp; **Server Repository:** [github.com/febappi/WedPlan-Server](https://github.com/febappi/WedPlan-Server)

<br>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-1-000000?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## Table of Contents

- [Features](#features)
- [Pages](#pages)
- [Technologies I Used](#technologies-i-used)
- [Test Accounts and Payments](#test-accounts-and-payments)
- [Running Locally](#running-locally)
- [Deploying to Vercel](#deploying-to-vercel)
- [Project Structure](#project-structure)
- [Photo Credits](#photo-credits)

## Features

### For everyone

- **Home page:** a hero with a photo slider (one photo per service category, cross-fade, pause button, keyboard support), category tiles, the six newest services with a **View all** button when there are more, a how-it-works section and a why-WedPlan section.
- **Browse Services:** search across name, description, city, category and business name (every word is matched), category and city filters, price sorting, pagination, loading skeletons and an empty state.
- **Responsive and careful UI:** works on phone, tablet and desktop. Toasts confirm every action, pages have loading, empty and error states, and unknown routes show a custom 404 page. Animations are turned off for people who prefer reduced motion.

### Accounts and roles

- **Sign up and sign in** with email and password or Google. Sign up asks for name, email, password, an optional profile photo (uploaded to ImgBB) and the account type (Customer or Vendor).
- **Live form checks:** the email is checked as you type, a checklist shows which password rules are met (6+ characters, one uppercase, one lowercase letter), and every password field has a show and hide button.
- **Three roles, three dashboards:** Customer, Vendor and Admin each get a sidebar, statistics cards and their own pages. Opening another role's page from the URL sends you back to your own dashboard, and the server checks the role again on every request.
- Admin accounts cannot be created from the website (see [Create the admin account](#create-the-admin-account)).

### Customers

- Open a service to see its photo gallery, price, city and vendor.
- Send a booking request with the event date (picked from a calendar, past dates disabled), location and a message.
- See every request with its status, open the details and cancel requests that are still pending.
- Nobody can book their own service, and a second open request for the same service and date is refused.

### Vendors

- Add, edit and delete services with up to 5 photos. Every new or edited service waits for admin approval.
- Switch a service on or off, and see its approval status.
- Accept or reject booking requests. A request can only be answered once.
- **Premium with Stripe:** the free plan keeps 3 active services. Premium ($19 a month, test mode) removes the limit and adds a Premium badge. Premium turns on only after Stripe's signed webhook confirms the payment, never from the success page. Cancelling keeps Premium until the paid month ends; after that only the three newest services stay active.

### Admins

- **Users:** search, filter by role, view details, block and unblock. Blocked users are signed out and cannot use the platform.
- **Services:** approve, reject, move back to pending or delete.
- **Transactions:** every Stripe payment, read only.

## Pages

| Page | Route | Who |
| --- | --- | --- |
| Home | `/` | Everyone |
| Browse Services | `/services` | Everyone |
| Service details | `/services/:id` | Signed in |
| Sign in, Sign up | `/signin`, `/signup` | Guests |
| Payment result | `/payment/success`, `/payment/cancel` | Vendor |
| Profile | `/dashboard/profile` | Signed in |
| Customer dashboard, My Bookings | `/dashboard/customer`, `/dashboard/customer/bookings` | Customer |
| Vendor dashboard | `/dashboard/vendor` | Vendor |
| My Services, Add, Edit | `/dashboard/vendor/services`, `.../new`, `.../:id/edit` | Vendor |
| Booking Requests | `/dashboard/vendor/bookings` | Vendor |
| Subscription | `/dashboard/vendor/subscription` | Vendor |
| Admin dashboard | `/dashboard/admin` | Admin |
| Manage Users, Services, Transactions | `/dashboard/admin/users`, `/services`, `/transactions` | Admin |

## Technologies I Used

- **Next.js 16** (App Router) with **TypeScript**
- **Tailwind CSS 4** and **shadcn/ui** (Base UI)
- **Better Auth** with the MongoDB adapter and the JWT plugin (email and password, Google)
- **Stripe Checkout** for the Premium subscription (test mode)
- **ImgBB** for profile and service photos, uploaded through a Next.js API route so the key stays on the server
- **Swiper** for the hero slider, **Framer Motion** for page animations
- **react-day-picker** and **date-fns** for the booking calendar
- **Lucide** icons
- **Express.js and MongoDB** backend: [WedPlan Server](https://github.com/febappi/WedPlan-Server)

## Test Accounts and Payments

- Admin login details are sent with the assignment submission.
- Create your own customer and vendor accounts from the Sign Up page.
- For Premium, use Stripe's test card `4242 4242 4242 4242` with any future expiry date and any CVC.

## Running Locally

You need Node.js 20 or newer, a MongoDB database and the [WedPlan Server](https://github.com/febappi/WedPlan-Server) running on port 5000.

```bash
git clone https://github.com/febappi/WedPlan.git
cd WedPlan
npm install
```

Create a `.env.local` file in the project root (you can copy `.env.example`):

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

Then start the app and open [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

- `MONGODB_URI` and `DB_NAME` must be the same as the server's. Better Auth and the server share the `users` collection, and the server reads Better Auth's public keys from the same database.
- In Google Cloud Console, add `http://localhost:3000/api/auth/callback/google` (and the live URL) as an authorised redirect URI.
- If a value has a `#` in it, wrap it in quotes, otherwise the rest is read as a comment.

### Create the admin account

Admins cannot sign up on the website. Fill in the `ADMIN_` values, then run this once:

```bash
npm run create-admin
```

It creates the account, or turns an existing account into an admin.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Check the code with ESLint |
| `npm run create-admin` | Create the admin account, or make an existing account an admin |

## Deploying to Vercel

1. Import the repository in Vercel and add the same environment variables as `.env.local` (the `ADMIN_` ones are not needed).
2. Set `BETTER_AUTH_URL` to the live site URL with `https://` and no trailing slash, and `NEXT_PUBLIC_API_URL` to the live server URL.
3. Use the same `BETTER_AUTH_SECRET` everywhere the database is shared, because Better Auth encrypts its signing keys with it.
4. `NEXT_PUBLIC_` values are built into the app, so redeploy after changing them.
5. Set the server's `CLIENT_URL` to the live site URL so CORS and token checks accept it.

## Project Structure

```text
src/
├── app/
│   ├── (main)/          public pages: home, services, sign in, sign up, payment result
│   ├── dashboard/       customer, vendor and admin dashboards and the profile page
│   └── api/             Better Auth handler and the ImgBB upload route
├── components/          UI grouped by feature (home, services, bookings, admin, ...)
├── hooks/
├── lib/                 auth, API helpers, validation, types and shared data
└── proxy.ts             sends signed-out visitors to sign in, then back to the page they wanted
scripts/
└── create-admin.mjs
```

## Photo Credits

The hero slider uses freely licensed photos from Wikimedia Commons. Each slide also shows its credit with a link.

| Slide | Photo | Author | License |
| --- | --- | --- | --- |
| Makeup & Styling | [Meribindiya Bridal Makeup](https://commons.wikimedia.org/wiki/File:Meribindiya_Bridal_Makeup.jpg) | Bridalglamguide | CC BY-SA 4.0 |
| Decoration & Florist | [Indoor wedding stage decoration in Kerala](https://commons.wikimedia.org/wiki/File:Indoor_wedding_stage_decoration_in_Kerala.jpg) | Ayga Events | CC BY-SA 4.0 |
| Wedding Fashion | [Bride and Groom During Pair Pujan Rasam](https://commons.wikimedia.org/wiki/File:Bride_and_Groom_During_Pair_Pujan_Rasam.jpg) | The open draft | CC BY-SA 4.0 |
| Photography & Videography | [Wedding photographer preparing shot](https://commons.wikimedia.org/wiki/File:Wedding_photographer_preparing_shot.jpg) | Mike Baird | CC BY 2.0 |
| Catering Services | [Bangladeshi traditional turmeric night's food](https://commons.wikimedia.org/wiki/File:Bangladeshi_traditional_turmeric_night%27s_food_and_its_decoration.jpg) | Syed Sajidul Islam | CC BY-SA 4.0 |
