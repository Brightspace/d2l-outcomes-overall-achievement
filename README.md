# d2l-outcomes-overall-achievement

[![CI][CI Badge]][CI Workflows]

A collection of components related to outcomes COA (Course Overall Achievement)

## Prerequisites

- NPM (Installs with [NodeJS](https://nodejs.org))

## Setup

1. Run `npm i` in project root directory

## Version Bump

1. Run `npm version --no-git-tag-version [major | minor | patch]` in project
root directory, selecting the appropriate version increase type.

This will bump the version in both `package.json` and `package-lock.json` and
leave it in your working changes.

## Component Demos

To view component demos, run `npm start`. A page should be launched with links to specific component demos.

## Components

- [Assessment List](#assessment-list)
- [Assessment Summary](#assessment-summary)
- [Big Trend](#big-trend)
- [Diamond](#diamond)
- [Mastery View Table](#mastery-view-table)
- [Mini Trend](#mini-trend)
- [Outcome Text Display](#outcome-text-display)
- [Overall Achievement Tile](#overall-achievement-tile)
- [Primary Panel](#primary-panel)
- [Stacked Bar](#stacked-bar)

---
### Assessment List<a name="assessment-list"></a>

A list of all current assessments in a chronological order for a particular user/outcome/course tripplet (excluding Checkpoint activities).

#### Usage

```html
<d2l-coa-assessment-list href="" token=""></d2l-coa-assessment-list>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome`
- `token` - Auth token

---

### Assessment Summary<a name="assessment-summary"></a>

A summary of all current assessments for a particular user/outcome/course tripplet (excluding Checkpoint activities).

#### Usage

```html
<d2l-coa-assessment-summary href="" token=""></d2l-coa-assessment-summary>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome-activities`
- `token` - Auth token

---

### Big Trend<a name="big-trend"></a>

An interactive display of all demonstrations of an outcome for a user in a course.

#### Usage

```html
<d2l-coa-big-trend href="" token="" outcomeTerm="" instructor></d2l-coa-big-trend>
```

#### Attributes

- `href` - Hypermedia URL for an `user-progress-outcome-activity` entity
- `token` - Auth token
- `outcomeTerm` - **[Optional]** The preferred term to use when referring to outcomes. Accepted values are: `competencies`, `expectations`, `objectives`, `outcomes` and `standards`. Default value is `standards`
- `instructor` - **[Optional]** Boolean attribute should be set when requesting user is an instructor. Used to display language better suited to the user's role.

---

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

---

### Mastery View Table<a name="mastery-view-table"></a>

A table displaying the overall outcome levels of achievement of each user in the course, plus class-level outcome achievement distribution

#### Usage

```html
<d2l-mastery-view-table href="" token=""></d2l-mastery-view-table>
```

#### Attributes

- `href` - Hypermedia URL for a `class-overall-achievement` entity
- `token` - Auth token

---

### Mini Trend<a name="mini-trend"></a>

A visual display of the 6 most recent demonstrations of an outcome for a user in a course.

#### Usage

```html
<d2l-coa-mini-trend href="" token=""></d2l-coa-mini-trend>
```

#### Attributes

- `href` - Hypermedia URL for an `user-progress-outcome-activity` entity
- `token` - Auth token

---

### Outcome Text Display<a name="outcome-text-display"></a>

Text display of outcome details.

#### Usage

```html
<d2l-coa-outcome-text-display href="" token=""></d2l-coa-outcome-text-display>
```

#### Attributes

- `href` - Hypermedia URL for an `outcome` entity
- `token` - Auth token

---

### Overall Achievement Tile<a name="overall-achievement-tile"></a>

Tile showing details of a user's demonstration towards a particular course Outcome Checkpoint.

#### Usage

```html
<d2l-coa-overall-achievement-tile href="" token=""></d2l-coa-overall-achievement-tile>
```

#### Attributes

- `href` - Hypermedia URL for a `user-progress-outcome-activity` entity
- `token` - Auth token

---

### Primary Panel<a name="primary-panel"></a>

A panel displaying a user's current progress toward achieving a given outcome within a given course.

#### Usage

```html
<d2l-coa-primary-panel href="" token=""></d2l-coa-primary-panel>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome`
- `token` - Auth token
- `outcomes-tool-link` - Link to the Outcomes Tool in the corresponding course. Displayed when there are no aligned outcomes in the course.
- `outcome-term` - **[Optional]** The preferred term to use when referring to outcomes. Accepted values are: `competencies`, `expectations`, `objectives`, `outcomes` and `standards`. Default value is `standards`

---

### Stacked Bar<a name="stacked-bar"></a>

A visual representation of the number of each level achieved on a particular user/outcome/course tripplet.

#### Usage

```html
<d2l-coa-stacked-bar href="" token="" compact></d2l-coa-stacked-bar>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome-activities`
- `token` - Auth token
- `compact` - **[Optional]** Boolean attribute, when present graph will be displayed in "compact mode" (does not show table on mobile displays)
- `excluded-types` - **[Optional]** JSON array of Activity types to be excluded from the graph

<!-- links -->
[CI Badge]: https://github.com/Brightspace/d2l-outcomes-overall-achievement/workflows/CI/badge.svg?branch=master
[CI Workflows]: https://github.com/Brightspace/d2l-outcomes-overall-achievement/actions?query=workflow%3ACI+branch%3Amaster
