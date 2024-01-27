> Get thumbnail images from any public video URL via API or browser and store them into R2 Cloudflare Storage.

## Features

- 🕑 Take thumbnails from any second of the video (default 1s, max 10s)
- ✅ Works on any public video URL
- 🖥 Works in the browser
- 🛠 Creates thumbnails with [video thumbnail]
- 🚦 Rate limits using [nuxt-rate-limit]
- ⚡ Super fast
- ✨ Built with [Nuxt](https://nuxt.com) 3

## Install

```sh
git clone
```

## Usage

```sh
npm run dev
npm run build
npm run start
```


## API

```sh
GET localhost:3000/api/get?url={URL}
```


## ENV

```sh
Set .env for R2 storage.
```

