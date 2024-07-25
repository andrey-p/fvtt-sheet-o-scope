Sheet-o-scope
====

This is a Foundry VTT module for looking at Foundry sheets in a window other than the main one.

Currently, it allows for a sheet to be viewed in a popup, similar to the excellent PopOut! module.

A longer term goal is for it to be a generic way of viewing sheets on any secondary window (e.g. in-person games where the scene is viewed on a large monitor, and players can look at their own character sheets on mobile devices).

Sheet-o-scope vs PopOut!
---

Sheet-o-scope works differently to PopOut! so it comes with a few pros and cons in comparison.

Pros:

- it supports sheets that PopOut! doesn't work fully with (e.g. PF2e)
- it works with Firefox (which is what I'm using to develop it with)
- it works when running Foundry VTT as an Electron application (with a number of caveats - see below)

Cons:

- it's slower to open
- it's generally heavier

If PopOut! works for your specific use case, you may want to consider sticking with it.

In the way of a more technical explanation: PopOut! works by duplicating the DOM of a sheet in a separate popup window, which allows it to only copy what it needs. Sheet-o-scope works by opening a second instance of Foundry VTT in a popup, then attempting to pare it down as much as possible (e.g. by forcing `noCanvas` mode). Sheet-o-scope's maximalist approach is what makes it support more use cases, and makes it heftier at the same time.

Caveats for Electron users
---

Ideas for addressing those are tracked via issue #7 (https://github.com/andrey-p/fvtt-sheet-o-scope/issues/7).

### You'll need a separate user just for viewing sheets

Once you've logged in via Electron, you won't be able to log in a second time using the same user - this is a built-in Foundry restriction, difficult to work around. You'll want to create a second user, and log into your game with it via the browser.

### You'll need to log in via your browser

When Sheet-o-scope attempts to open a new popup from Electron, it will open in your default browser (e.g. http://localhost:30000). If your browser session is not logged in, the information about what popup you were about to open will be lost.

The fix is to:

1. Open http://localhost:30000 first, and log in to the running Foundry world
2. Continue using Sheet-o-scope as you would.

### Sheets opens in a full tab rather than a popup

This is more cosmetic than anything. The UX is a little off.

Setting up for dev
---

You need a locally installed instance of Foundry VTT.

### 1. Clone this repo and run `npm install`

```bash
git clone https://github.com/andrey-p/fvtt-sheet-o-scope # or similar
cd fvtt-sheet-o-scope
npm install
```

### 2. Configure foundryvtt-cli

Run `npx fvtt configure` and follow any prompts it gives you, e.g. `npx fvtt set installPath [path to your local Foundry install]`.

### 3. Set up the dev version of this module in your Foundry instance

You can symlink the module to your Foundry data folder. See https://foundryvtt.com/article/user-data/ for where this might live.

I did something like:

```bash
ln -s [wherever it is you cloned the repo]/fvtt-sheet-o-scope/build /home/$USER/.local/share/FoundryVTT/Data/modules/sheet-o-scope
```

### 4. Create a world to develop against

Create a new world (e.g. with the PF2e system or similar) called `local-dev`. Log in as a GM and enable the `sheet-o-scope` module.

### 5. Dev!

In two separate terminal tabs, do:

```
npm run dev
npm run foundry-dev
```

You can now open http://localhost:30000 and interact with the module there.

Run `npm run ci` to have your code sanity checked.
