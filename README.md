# matrix-roles-diff

## Installation

Clone the project locally:

```sh
> git clone https://github.com/ThisseasX/matrix-roles-diff.git
```

Then install dependencies:

```sh
> npm install
```

## Setup

Create a `.env` file at the root of the project containing the following two environment variables:

```
FE_DB=mongodb://host:port/databaseFE
BE_DB=mongodb://host:port/databaseBE
```

Optionally, you can also create two json mock files in `src/mocks/` named `mock-fe.json` and `mock-be.json`.

## Usage

To test locally with predefined mocks if provided, you can use:

```sh
> npm run dev
```

To attempt to connect to the actual databases defined in the envirnoment variables, you can use:

```sh
> npm start
```

Either of those commands will create a `results/` folder at the root of the project, with the result of each run, prefixed by `dev-` if using `npm run dev`, and suffixed by the current timestamp.

## Result

The result shows which data exist in one DB and not in the other and vice versa.
