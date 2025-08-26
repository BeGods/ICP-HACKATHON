BEGODS Launcher Frontend

## System Architecture

```
.
├── Dockerfile
├── Dockerfile.dev
├── index.html
├── package.json
├── postcss.config.js
├── public
│   ├── assets
│   └── favicon
├── src
│   ├── app
│   │   ├── common
│   │   │   ├── Announcement.jsx
│   │   │   ├── Auth
│   │   │   ├── Intro
│   │   │   ├── Missions
│   │   │   ├── Notification.jsx
│   │   │   ├── Profile
│   │   │   └── Vouchers.jsx
│   │   ├── dod
│   │   │   ├── Battle.jsx
│   │   │   ├── Home.jsx
│   │   │   └── UpdateDeck.jsx
│   │   ├── fof
│   │   │   ├── Bonus
│   │   │   ├── Booster
│   │   │   ├── Forge
│   │   │   ├── Leaderboard
│   │   │   ├── Quest
│   │   │   └── Tower
│   │   ├── main
│   │   │   ├── DoD.jsx
│   │   │   ├── FoF.jsx
│   │   │   └── RoR.jsx
│   │   └── ror
│   │       ├── Apothecary.jsx
│   │       ├── Bank.jsx
│   │       ├── Bonus
│   │       ├── Citadel
│   │       ├── Explore
│   │       ├── Furnace.jsx
│   │       ├── Inventory.jsx
│   │       ├── Leaderboard
│   │       ├── Library.jsx
│   │       └── Tavern.jsx
│   ├── App.jsx
│   ├── assets
│   │   ├── assets.json
│   │   ├── characters.json
│   │   └── relics.json
│   ├── components
│   │   ├── Buttons
│   │   │   ├── IconBtn.jsx
│   │   │   ├── ICPBtn.jsx
│   │   │   ├── PotionBtn.jsx
│   │   │   ├── PrimaryBtn.jsx
│   │   │   └── SecondaryBtn.jsx
│   │   ├── Cards
│   │   │   ├── Boosters
│   │   │   ├── Canvas
│   │   │   ├── Citadel
│   │   │   ├── DoD
│   │   │   ├── Info
│   │   │   ├── Quests
│   │   │   ├── Relics
│   │   │   └── Reward
│   │   ├── Common
│   │   │   ├── Avatar.jsx
│   │   │   ├── MappedOrbs.jsx
│   │   │   ├── ScratchCrd.jsx
│   │   │   ├── SectionToggles.jsx
│   │   │   ├── Symbol.jsx
│   │   │   └── ToggleSwitch.jsx
│   │   ├── Fx
│   │   │   ├── DrawCrd.jsx
│   │   │   ├── GachaRoll.jsx
│   │   │   └── LoadRoll.jsx
│   │   ├── Layouts
│   │   │   ├── AppLayout.jsx
│   │   │   ├── BasicLayout.jsx
│   │   │   ├── BgLayout.jsx
│   │   │   ├── CarouselLayout.jsx
│   │   │   ├── DoDHeader.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── GridItem.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HeaderLayout.jsx
│   │   │   ├── ModalLayout.jsx
│   │   │   ├── OverlayLayout.jsx
│   │   │   ├── RandomBg.jsx
│   │   │   ├── TgHeader.jsx
│   │   │   └── Wrapper.jsx
│   │   ├── Loaders
│   │   │   ├── DoDLoader.jsx
│   │   │   ├── FoFLoader.jsx
│   │   │   └── RoRLoader.jsx
│   │   ├── Modals
│   │   │   ├── Holdings.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Update.jsx
│   │   │   └── Wallets.jsx
│   │   ├── Toast
│   │   │   ├── Toast.jsx
│   │   │   └── ToastMesg.jsx
│   │   └── Tutorials
│   │       ├── RorTutorial.jsx
│   │       └── Tutorials.jsx
│   ├── context
│   │   └── DappWallet.jsx
│   ├── helpers
│   │   ├── booster.helper.js
│   │   ├── confetti.js
│   │   ├── cookie.helper.js
│   │   ├── game.helper.js
│   │   ├── leaderboard.helper.js
│   │   ├── quests.helper.js
│   │   ├── randomColor.helper.js
│   │   ├── ror.timers.helper.js
│   │   └── streak.helper.js
│   ├── hooks
│   │   ├── useDappWallet.jsx
│   │   ├── useDisableClick.jsx
│   │   ├── useDragDrop.jsx
│   │   ├── useGameAds.jsx
│   │   ├── useICPWallet.jsx
│   │   ├── useMaskStyle.jsx
│   │   ├── useSocialLogin.jsx
│   │   ├── useTonWallet.jsx
│   │   └── useTutorial.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── store
│   │   └── useStore.js
│   ├── styles
│   │   ├── animations.scss
│   │   ├── arrow.scss
│   │   ├── card.scss
│   │   ├── carousel.scss
│   │   ├── credits.scss
│   │   ├── dnd.scss
│   │   ├── flip.scss
│   │   ├── glowButton.scss
│   │   ├── lottie.scss
│   │   ├── main.scss
│   │   ├── moon.scss
│   │   ├── scratch.scss
│   │   ├── toast.css
│   │   └── toggle.scss
│   ├── translations
│   │   ├── bn
│   │   ├── cn
│   │   ├── en
│   │   ├── es
│   │   ├── fil
│   │   ├── ha
│   │   ├── hi
│   │   ├── id
│   │   ├── ja
│   │   ├── ko
│   │   ├── my
│   │   ├── pt
│   │   ├── ru
│   │   ├── th
│   │   └── yo
│   └── utils
│       ├── api
│       │   ├── dod.js
│       │   ├── fof.js
│       │   ├── ror.js
│       │   └── shared.js
│       ├── constants.fof.js
│       ├── constants.ror.js
│       ├── country.js
│       ├── device.info.js
│       ├── fetchDetails.js
│       ├── firebase.js
│       ├── ga.js
│       ├── gameItems.js
│       ├── i18next.js
│       ├── line.js
│       ├── ror.api.js
│       ├── socket.js
│       ├── tauri.js
│       ├── tele.country.js
│       ├── teleBackButton.js
│       └── tg.analytics.js
├── src-tauri
│   ├── src
│   └── tauri.conf.json
├── tailwind.config.js
├── vite.config.ts
└── yarn.lock

```
