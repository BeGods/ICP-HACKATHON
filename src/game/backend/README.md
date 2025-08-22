BEGODS Launcher Backend

## System Architecture

```
├── secrets
│   └── firebase.admin.config.json   # Firebase secrets
├── src
│   ├── assets                        # Game metadata (characters, quests, relics)
│   │   ├── characters.json
│   │   ├── quests.json
│   │   └── relics.json
│   ├── common                        # Shared components
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   └── services
│   ├── config                        # App configuration
│   │   ├── database
│   │   ├── alibaba.ts
│   │   ├── config.ts
│   │   ├── firebase.ts
│   │   └── socket.ts
│   ├── dod                           # Game III (DOD)
│   │   ├── controllers
│   │   ├── helpers
│   │   ├── middlewares
│   │   ├── routes
│   │   └── services
│   ├── fof                           # Game I (FOF)
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── routes
│   │   └── services
│   ├── helpers                       # Utility functions
│   │   ├── auth.helpers.ts
│   │   ├── bonus.helpers.ts
│   │   ├── booster.helpers.ts
│   │   ├── crypt.helpers.ts
│   │   ├── game.helpers.ts
│   │   ├── general.helpers.ts
│   │   ├── quests.helpers.ts
│   │   └── streak.helpers.ts
│   ├── ror                           # Game II (ROR)
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── routes
│   │   └── services
│   ├── scripts                       # Scheduled tasks
│   │   └── updateLeaderboard.ts
│   ├── tests
│   │   ├── dod.test.ts
│   │   ├── math.test.ts
│   │   └── shuffle.test.js
│   ├── ts                            # TypeScript definitions
│   │   ├── models
│   │   ├── models.interfaces.ts
│   │   └── objects.interfaces.ts
│   ├── utils
│   │   ├── constants
│   │   ├── logger
│   │   └── nanoId.ts
│   ├── app.ts
│   ├── router.ts
│   └── server.ts
├── .env
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
└── package.json

```
