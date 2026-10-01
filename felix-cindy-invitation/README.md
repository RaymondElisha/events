# Felix & Cindy — White & Gold Folding Wedding Invitation

A mobile-first, full-viewport wedding invitation inspired by the interaction pattern at felixandcindy.com while using a new white/ivory and gold visual direction.

## Included
- Full-page four-way envelope opening controlled by scroll
- Reverse fold when scrolling back to the top
- Six invitation panels inside one continuous inner card
- Editable names, date, guest name/count, invitation code, church, reception venue, Google Maps links, wording and two photos
- Device-local save with `localStorage`
- Shareable URL state
- Live wedding countdown
- Add-to-calendar .ics export
- Print / save-PDF invitation action
- Responsive mobile layout
- Reduced-motion accessibility fallback

## Run locally
From the repository root:

```bash
cd felix-cindy-invitation
python -m http.server 8080
```

Then open http://localhost:8080.

## Editing
Tap **Edit** at the top-right of the invitation. Changes appear instantly. **Save on this device** persists them locally; **Create share link** puts the edited state into a shareable URL.

## Deployment
This folder is static HTML/CSS/JavaScript and can be deployed directly to Vercel with the project root set to `felix-cindy-invitation` and no build command.
