## Things to install
1. [mise](https://mise.jdx.dev/)
2. [pnpm](https://pnpm.io/)
3. [docker]( https://docs.docker.com/get-started/get-docker/ )


## How to get started
1. copy `.env.example` and make a new file `.env`
```bash
cp .env.example .env
```

2. Install required packages
```bash
mise install
```

3. Install packages
```bash
pnpm install
```

4. Create and run database
```bash
docker-compose up -d
```

5. Run backend migrations
```bash
pnpm db:migrate
```

6. Run `backend` + `web-app`
```bash
pnpm dev
```
