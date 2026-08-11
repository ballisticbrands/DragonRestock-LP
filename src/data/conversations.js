/* ──────────────────────────────────────────────────────────────
   MCP chat transcripts for MCPChatDemo.

   All three use the shared story in data/story.js — Ridgeline
   Apparel, shirts from Lianfa Textiles, hats from Dongfeng
   Headwear. Read top to bottom they tell one continuous week:
   onboard the costs → get the plan → chase the late supplier.

   Keep bot messages short-ish; they play through a typewriter.
   ────────────────────────────────────────────────────────────── */

export const CONVERSATIONS = [
  {
    key: 'onboard',
    label: 'Onboard from a spreadsheet',
    caption: 'Onboarding over MCP — point it at a sheet instead of typing costs into a form.',
    messages: [
      {
        role: 'user',
        text: 'Here are my costs: https://docs.google.com/spreadsheets/d/1kR9v — pull them into DragonRestock.',
      },
      {
        role: 'bot',
        text: 'Reading it now. Two tabs — “Shirts” and “Hats” — 42 rows total.',
      },
      {
        role: 'bot',
        text: 'Matched 38 SKUs to your Amazon catalog:\n\n• Lianfa Textiles → SHIRT-RED-M, SHIRT-BLU-L, SHIRT-GRN-S + 15 more\n• Dongfeng Headwear → HAT-BLK-OS, HAT-NVY-OS, HAT-RED-OS + 17 more\n\n4 rows didn’t match — they’re SKUs you discontinued in 2024. I left them out.',
      },
      {
        role: 'bot',
        text: 'One gap: the sheet has FOB cost but no freight. I looked at your last 6 shipments and worked out $0.42/unit on shirts and $0.31/unit on hats.\n\nUse those, or do you have real numbers?',
      },
      { role: 'user', text: 'Use those for now.' },
      {
        role: 'bot',
        text: 'Done — landed cost is live on all 38 SKUs, and every margin figure now reflects it.\n\nYou’re set up. Want your first restock plan? 🐉',
      },
    ],
  },
  {
    key: 'plan',
    label: 'What do I order this week?',
    caption: 'The answer, not the dashboard — with the POs drafted and the cash already checked.',
    messages: [
      { role: 'user', text: 'What do I need to order this week?' },
      {
        role: 'bot',
        text: 'Two things.\n\n1 · SHIRT-RED-M — 9 days of cover, goes to zero Aug 19. Order 1,200 from Lianfa today.\n2 · HAT-BLK-OS — 21 days of cover. Order 800 from Dongfeng by Aug 14.\n\nEverything else is covered through September.',
      },
      { role: 'user', text: 'Why 1,200 on the red shirt?' },
      {
        role: 'bot',
        text: 'It’s selling 42.3/day and trending up 18% against its 90-day baseline. Lianfa needs 25 days, freight is 45, Amazon check-in is 7 — so anything you order today lands Oct 27.\n\n1,200 covers you to the Q4 lift with 21 days of buffer. It’s also 2 units under a full container layer, so going bigger costs you nothing extra in freight if you want the cushion.',
      },
      { role: 'user', text: 'Draft both POs.' },
      {
        role: 'bot',
        text: 'Drafted and waiting in your approvals queue:\n\n• PO-1051 · Lianfa · 1,200 × SHIRT-RED-M · $4,680 landed · $1,404 deposit\n• PO-1052 · Dongfeng · 800 × HAT-BLK-OS · $2,240 landed · $672 deposit\n\nYour Aug 15 Amazon payout covers both deposits with $3,100 left over. 🐉',
      },
    ],
  },
  {
    key: 'supplier',
    label: 'Chase a supplier',
    caption: 'It knows what each supplier actually does, not what they promised.',
    messages: [
      { role: 'user', text: 'When is the blue shirt order from Lianfa supposed to be done?' },
      {
        role: 'bot',
        text: 'PO-1042 — 1,200 × SHIRT-BLU-L, deposit paid Jul 22.\n\nLianfa quoted 25 days, so completion lands Aug 16. Their last four orders ran 3–6 days late, so I’d plan on Aug 20.',
      },
      {
        role: 'bot',
        text: 'That’s a problem. You need these in FBA by Oct 2. Aug 20 + 45 days freight + 7 days check-in puts them at Oct 11 — nine days after you stock out.',
      },
      { role: 'user', text: 'Can we pull it forward?' },
      {
        role: 'bot',
        text: 'I’ll message Wei on WeChat first thing Monday their time and push for Aug 22.\n\nIf that’s a no, the fallback is air-freighting 300 units — about $840, against roughly $6,100 in lost sales at current velocity.\n\nI’ll report back Tuesday. 🐉',
      },
    ],
  },
];
