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
- [Diamond](#diamond)
- [Outcome Text Display](#outcome-text-display)
- [Overall Achievement Tile](#overall-achievement-tile)
- [Stacked Bar](#stacked-bar)

### Assessment Summary<a name="assessment-summary"></a>

#### Usage

```html
<d2l-coa-assessment-summary href="" token=""></d2l-coa-assessment-summary>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome-activities`
- `token` - Auth token

### Diamond<a name="diamond"></a>

#### Usage

```html
<d2l-coa-diamond color="" edge-width="" width=""></d2l-coa-diamond>
```

#### Attributes

Requires either `edge-width` or `width` attribute to be provided, but not both (`edge-width` supercedes `width`).

- `color` - The fill color of the diamond
- `edge-width` - Used to size the diamond by the length of a single edge (number of pixels)
- `width` - Used to size the diamond by its overall container width (number of pixels)

### Outcome Text Display<a name="outcome-text-display"></a>

#### Usage

```html
<d2l-coa-outcome-text-display href="" token=""></d2l-coa-outcome-text-display>
```

#### Attributes

- `href` - Hypermedia URL for an `outcome` entity

- `token` - Auth token

### Overall Achievement Tile<a name="overall-achievement-tile"></a>

#### Usage

```html
<d2l-coa-overall-achievement-tile href="" token=""></d2l-coa-overall-achievement-tile>
```

#### Attributes

- `href` - Hypermedia URL for a `user-progress-outcome-activity` entity
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
- `excluded-types` - **[Optional]** JSON array of Activity types to be excluded from the graph
