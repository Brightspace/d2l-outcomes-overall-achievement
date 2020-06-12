# d2l-outcomes-overall-achievement

A collection of components related to outcomes COA (Course Overall Achievement)

## Prerequisites

- NPM (Installs with [NodeJS](https://nodejs.org))

## Setup

1. Run `npm i` in project root directory

## Component Demos

To view component demos, run `npm start`. A page should be launched with links to specific component demos.

## Components

- [Assessment Summary](#assessment-summary)
- [Stacked Bar](#stacked-bar)

### Assessment Summary<a name="assessment-summary"></a>

#### Usage

```html
<d2l-coa-assessment-summary href="" token=""></d2l-coa-assessment-summary>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome-activities`
- `token` - Auth token

### Stacked Bar<a name="stacked-bar"></a>

#### Usage

```html
<d2l-coa-stacked-bar href="" token="" compact></d2l-coa-stacked-bar>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome-activities`
- `token` - Auth token
- `compact` - **[Optional]** Boolean attribute, when present graph will be displayed in "compact mode" (does not show table on mobile displays)
