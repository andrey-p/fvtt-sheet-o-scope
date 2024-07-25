Sheet-o-scope
====

This is a [Foundry VTT](https://foundryvtt.com/) module for looking at Foundry sheets in a window other than the main one.

Currently, it allows for a sheet to be viewed in a popup, similar to the excellent PopOut! module.

A longer term goal is for it to be a generic way of viewing sheets on any secondary window (e.g. in-person games where the scene is viewed on a large monitor, and players can look at their own character sheets on mobile devices).

Sheet-o-scope vs PopOut!
---

Sheet-o-scope works differently to PopOut! so it comes with a few pros and cons in comparison.

Pros:

- it supports sheets that PopOut! doesn't work fully with (e.g. PF2e)
- it works with Firefox (which is what I'm using to develop it with)
- it works when running Foundry VTT locally as an Electron application (with a number of caveats - see below)

Cons:

- it's slower to open
- it's generally heavier

If PopOut! works for your specific use case, you may want to consider sticking with it.

In the way of a more technical explanation: PopOut! works by duplicating the DOM of a sheet in a separate popup window, which allows it to only copy what it needs. However, it cannot copy things outside of the sheet's DOM, which makes things break.

Sheet-o-scope works by opening a second instance of Foundry VTT in a popup, then attempting to pare it down as much as possible (e.g. by forcing `noCanvas` mode). Sheet-o-scope's maximalist approach is what makes it support more use cases, and makes it heftier at the same time.

Caveats for users running Foundry locally via the Electron app
---

If you're running Foundry on your own PC, you're likely running your server using Electron. This comes with a whole host of issues, at least as far as Sheet-o-scope is concerned: it means that you'll need to log in twice (once as a GM in the Electron app, once in your browser to view your sheets).

Foundry is built around a user only ever logging in once at a time - if you've logged in the Electron app, your name will be greyed out when it comes to log in via the browser.

Another current issue is that going through the game log in screen will "forget" what sheet you were just trying to open.

So, to work around these, this should work:

1. Create a new user and grant them GM / assistant GM rights
2. On the day of your game, start Foundry locally as you normally would
3. Using your browser, open http://localhost:30000 (this URL might be vary) and login as your new user
4. Detaching your sheets using Sheet-o-scope should now work!

This is obviously not a great experience. Ideas to improve these are tracked via issue https://github.com/andrey-p/fvtt-sheet-o-scope/issues/7.

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
