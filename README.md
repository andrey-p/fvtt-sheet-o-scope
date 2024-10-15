Sheet-o-scope
====

This is a [Foundry VTT](https://foundryvtt.com/) module for looking at Foundry sheets in a window other than the main one.

Sheet-o-scope allows for various types of sheets to be detached from the main Foundry window, and sent to a separate popup that you can move to a second monitor. This leaves your main Foundry screen nice and decluttered - extra handy if you're a GM running a complicated encounter!

A longer term goal is for it to be a generic way of viewing sheets on any secondary window (e.g. in-person games where the scene is viewed on a large monitor, and players can look at their own character sheets on mobile devices).

Features
---

Currently, the following types of sheets can be detached:

- actor sheets (that is: character sheets, NPC sheets, etc)
- journals
- item sheets

If you want any other types supported, drop an issue in the tracker.

### Settings

There's a couple of settings to tweak the behaviour of Sheet-o-scope.

#### Controlled / uncontrolled mode

By default, Sheet-o-scope attempts to dynamically resize the popup window it opens depending on how many sheets are currently open.

If you find this behaviour annoying, you can disable it by setting Sheet-o-scope to 'uncontrolled mode'.

### Sticky mode

By default, Sheet-o-scope closes the secondary window if the last sheet on display is closed.

You may find this annoying if you're GMing and interested in keeping the window open throughout the session - you can keep it open even if there's no sheets left by enabling 'sticky mode'.


Installing
---

### Latest release version

This module is still under heavy development and so hasn't been propely published to the Foundry module repository.

You can install the latest stable(ish) version by using this manifest URL:

```
https://github.com/andrey-p/fvtt-sheet-o-scope/releases/latest/download/module.json
```

### Latest development version

Use this manifest.json URL instead:

```
https://raw.githubusercontent.com/andrey-p/fvtt-sheet-o-scope/main/dist/module.json
```

Sheet-o-scope vs PopOut!
---

Sheet-o-scope is very similar to, but not quite the same as, the excellent PopOut! module.

One of the main differences is, Sheet-o-scope sends all of the popped out sheets to a single popup, whereas PopOut! creates a single popup per detached sheet.

Apart from that, Sheet-o-scope is implemented very differently to PopOut! so it comes with a few pros and cons in comparison.

Pros:

- it has better support for sheets for systems that PopOut! doesn't (e.g. PF2e)
- it has better support for browsers that Foundry supports, but PopOut! doesn't (e.g. Firefox)

Cons:

- it's much slower to open the first time round, and generally uses more resources
- it currently supports a narrower range of sheet types

If PopOut! works for your specific use case, you may want to consider sticking with it.

### In the way of a more technical explanation

PopOut! works by duplicating the DOM of a sheet in a separate popup window, which allows it to only copy what it needs, keeping things super light. However, it cannot copy things outside of the sheet's DOM, which makes things break.

Sheet-o-scope works by opening a second instance of Foundry VTT in a popup, then attempting to pare it down as much as possible (e.g. by forcing `noCanvas` mode). Sheet-o-scope's maximalist approach is what makes it support more use cases, and makes it heftier at the same time.

Both of these go against a central assumption that Foundry VTT has (i.e. that a user will only ever interact with a single Foundry window), so a fully perfect approach is not possible.

Running Foundry locally via the Electron app
---

If you're running Foundry on your own PC, you're likely running your Foundy server using Electron. This, sadly, is difficult for Sheet-o-scope to support.

Ideas to fix this are tracked via issue https://github.com/andrey-p/fvtt-sheet-o-scope/issues/7.

In the meantime, you could circumvent this using the Foundry CLI: https://github.com/foundryvtt/foundryvtt-cli.

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
