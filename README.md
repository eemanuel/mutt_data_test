# Mutt Data Test

![alt text](./frontend/src/mutt_data.jpg)

## Problem

### Description of the task

Develop a full-stack web application used by users to quickly look at the last 90 days of
5 coins based on data from CoinGecko API, which is open and needs no auth for small
numbers of requests. We suggest the following 5 coins but feel free to choose your own
favorites: BTC, ETH, MKR, BNB, XMR. Your app won’t need auth of any kind.

The app should present a nav sidebar with links to the pages: /table and /charts. You
can of course add anything else that you think users of this app would like to have. Make
sure to show off your skills in making a reasonable modern and responsive design.

To implement this, write a small, modern frontend (use the framework of your choice but
we much prefer React here; ideally with TypeScript though it can also be just plain
JavaScript if you’re not familiar with TS) that gets its data exclusively from a simple API
you will implement in Python, and this backend will request the coin data from
CoinGecko and persist in a local Postgres database.

In /table, the user should be able to see for each coin the daily price (in USD), market
cap, and total volume in the last 90 days in table format. | As a bonus, can add sorting,
filtering, pagination, and/or any other columns from the CoinGecko API that seem useful.

In /charts, show a time-series chart comparing the price of each coin for the last 90
days with daily (default), weekly, and monthly granularity as chosen by the user. Use
whatever charting library you prefer. | As a bonus also add charts for market cap and
total volume, make the charts look good, interactive, and allow filtering by coins.

To obtain the data (do note it’s very similar for each page), request it from an endpoint in
your backend, which should respond immediately with the cached data in the Postgres
database, but also, if the route controller sees that the data is over 10 minutes old 1 (and
only then) it should asynchronously refresh it, in the form of triggering a background job
that re-requests the data from endpoints in the CoinGecko API and stores it in the
database. This is similar to a stale-while-revalidate caching strategy.

### If you want to stand out by going the extra mile, you could do some of the following:

- Add tests for your code
- Containerize the app
- Deploy the API to a real environment
- Use AWS SES or another 3rd party API to implement the notification system
- Provide API documentation (ideally, auto generated from code)
- Propose an architecture design and give an explanation about how it should scale in the future
- Delivering your solution

- Chart the 5-day moving average for coins and plot it together with the price (in the React side).
- Light and dark modes; the setting should be preserved if the browser is closed
- Add a button to force-refresh the data in the backend, but only once per minute
- User can star / favorite coins, not lost on refreshes or changing browser
- User can export as CSV the data being shown
- Database migrations, e.g. using Alembic
- Make it aesthetically pleasing, following modern standards for design; use tools like
  TailwindCSS or whatever you prefer; create a great UX for both desktop and mobile
- Consider using react-query or swr and adding auto-refresh every 30 seconds
- Server-side Rendering (SSR) or SSG (Static Site Generation); PWA features
- Manage Python dependencies with Poetry (we have our own intro guide)
- Some basic (unit or integration) testing with pytest
- Adding rate-limiting to your endpoints
- Add CI/CD or even deploy your solution online (share the URL with us 😃 )
- Anything else you can think of!

## Requirements

You need have Docker and Docker Compose installed in your system

Follow the steps for example in:
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

## Clone repository

```sh
$ git clone https://github.com/eemanuel/mutt_data_test
```

## Run docker-compose commands

```sh
$ export ENVIRONMENT=local  # to local installations
$ docker-compose up
```

Go to the `mutt_data_project-api-1` container's shell

```sh
$ docker exec -ti mutt_data_project-api-1 bash
```

Here, you can run the backend tests:

```sh
$ pytest --disable-warnings -q
```

You can populate the database too, with random values, excecuting the following command:

```sh
$ ./manage.py fill_database
```

## Install pre-commit locally

If you are develoeper you should install in you system:

```sh
pip install pre-commit
```

And at .git folder level execute:

```sh
pre-commit install
```

## Endpoints

### Frontend

[GET] http://localhost:3000

### Admin

[GET] http://localhost:8000/admin/

### Check information about all endpoints:

[GET] http://localhost:8000/api/schema/

### Crypto Values

**Get last 90 days crypto infos:**
[GET] http://localhost:8000/api/crypto_values/last_90_days/

### Flower:

[GET] http://localhost:5555/

## To Do In The Future

● Test better the backend and write frontend tests.
● Think in more ways to modularize and abstract elements to make the code cleaner.
● Analize all the styles and think if the appearence should be nicer.
● Enhance the graphic Chart.
● Check if React Redux should be implemented.
● Make better UX with better colors, better dark and light themes
● Enhance the responsiveness paying attention to all components
● If It is necessary, save in the database all the data requested from Coingecko, removing all or almost all the django cache, creating a relationship between the daily registers with the 10 mins registers or similar, to avoid heavy queries if the db increases their size with the time.
● Write a better pre-commit, checking the newest hooks.
● Try to implment tailwind v4 in place of the v3 used in the current project.
● Check if some pattern designs should be used to write cleaner code.
● Analize more patiently the cache management in the backend.

● add filtering, pagination, and/or any other columns from the CoinGecko API that seem useful.
● Manage Python dependencies with Poetry (we have our own intro guide)
● Database migrations, e.g. using Alembic
● Consider using react-query or swr and adding auto-refresh every 30 seconds
● User can star / favorite coins, not lost on refreshes or changing browser
● Chart the 5-day moving average for coins and plot it together with the price (How would you do this if you had to implement it in the React side?)
● Server-side Rendering (SSR) or SSG (Static Site Generation); PWA features
● Adding rate-limiting to your endpoints
● Add CI/CD or even deploy your solution online (share the URL with us 😃)
