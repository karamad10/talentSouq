# TalentSouq domain cutover

Use this when moving `talentsouq.it.com` or `www.talentsouq.it.com` to the
Vercel web app.

## Current DNS observation

As of the latest local check:

- `www.talentsouq.it.com` resolves to Namecheap parking.
- `talentsouq.it.com` resolves to Namecheap parking.
- That means Vercel showing `Invalid Configuration` for
  `www.talentsouq.it.com` is expected.

## What to do in Vercel

1. Keep the domain attached to the TalentSouq web project in Vercel.
2. Open the invalid domain card.
3. Copy the exact DNS target Vercel shows for the hostname.
   - For `www.talentsouq.it.com`, Vercel should request a `CNAME`.
   - For `talentsouq.it.com`, Vercel should request an `A` record.
4. Do not use Vercel nameservers yet unless we first copy every existing DNS
   record that must survive, including email records.

## What to do in Namecheap

For `www.talentsouq.it.com`:

1. Remove the Namecheap parking record for `www`.
2. Add a `CNAME` record:
   - Host: `www`
   - Value: copy the exact target shown by Vercel
3. Save and wait for DNS propagation.

For `talentsouq.it.com` apex:

1. Remove the Namecheap parking `A` record for `@`.
2. Add the `A` record value shown by Vercel.
3. Save and wait for DNS propagation.

## Mobile app safety

Using the domain for the mobile app does not prevent hosting the web app on
Vercel. It only means the web deployment must also serve the mobile association
files:

- `/.well-known/apple-app-site-association`
- `/.well-known/assetlinks.json`

The web app now includes the same files copied from the admin app. The iOS file
is filled for `H6Y78Q6XSV.com.karehan.app`. The Android file still contains the
placeholder `REPLACE_WITH_PLAY_APP_SIGNING_SHA256`; replace it with the real Play
Console app-signing SHA-256 fingerprint before expecting Android App Links to
verify.

## Supabase Auth URLs to add

Add these to Supabase Auth redirect URLs before testing production auth:

- `http://localhost:3000/auth/callback`
- Vercel preview URL + `/auth/callback`
- `https://www.talentsouq.it.com/auth/callback`
- `https://talentsouq.it.com/auth/callback` if the apex also serves the app

Keep any existing mobile deep-link URLs.
