# d2l-outcomes-overall-achievement

A collection of components related to outcomes COA (Course Overall Achievement)

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

### Assessment List

A list of all current assessments in a chronological order for a particular
user/outcome/course tripplet (excluding Checkpoint activities).

#### Usage

```html
<d2l-coa-assessment-list href="" token=""></d2l-coa-assessment-list>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome`
- `token` - Auth token

### Assessment Summary

A summary of all current assessments for a particular user/outcome/course
tripplet (excluding Checkpoint activities).

#### Usage

```html
<d2l-coa-assessment-summary href="" token=""></d2l-coa-assessment-summary>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of
`user-progress-outcome-activities`
- `token` - Auth token

### Big Trend

An interactive display of all demonstrations of an outcome for a user in a
course.

#### Usage

```html
<d2l-coa-big-trend href="" token="" outcomeTerm="" instructor></d2l-coa-big-trend>
```

#### Attributes

- `href` - Hypermedia URL for an `user-progress-outcome-activity` entity
- `token` - Auth token
- `outcomeTerm` - **[Optional]** The preferred term to use when referring to
outcomes. Accepted values are: `competencies`, `expectations`, `objectives`,
`outcomes` and `standards`. Default value is `standards`
- `instructor` - **[Optional]** Boolean attribute should be set when requesting
user is an instructor. Used to display language better suited to the user's
role.

### Diamond

#### Usage

```html
<d2l-coa-diamond color="" edge-width="" width=""></d2l-coa-diamond>
```

#### Attributes

Requires either `edge-width` or `width` attribute to be provided, but not both
(`edge-width` supercedes `width`).

- `color` - The fill color of the diamond
- `edge-width` - Used to size the diamond by the length of a single edge
(number of pixels)
- `width` - Used to size the diamond by its overall container width
(number of pixels)

### Mastery View Table

A table displaying the overall outcome levels of achievement of each user in the
course, plus class-level outcome achievement distribution

#### Usage

```html
<d2l-mastery-view-table href="" token=""></d2l-mastery-view-table>
```

#### Attributes

- `href` - Hypermedia URL for a `class-overall-achievement` entity
- `token` - Auth token

### Mini Trend

A visual display of the 6 most recent demonstrations of an outcome for a user in
a course.

#### Usage

```html
<d2l-coa-mini-trend href="" token=""></d2l-coa-mini-trend>
```

#### Attributes

- `href` - Hypermedia URL for an `user-progress-outcome-activity` entity
- `token` - Auth token

### Outcome Text Display

Text display of outcome details.

#### Usage

```html
<d2l-coa-outcome-text-display href="" token=""></d2l-coa-outcome-text-display>
```

#### Attributes

- `href` - Hypermedia URL for an `outcome` entity
- `token` - Auth token

### Overall Achievement Tile

Tile showing details of a user's demonstration towards a particular course
Outcome Checkpoint.

#### Usage

```html
<d2l-coa-overall-achievement-tile href="" token=""></d2l-coa-overall-achievement-tile>
```

#### Attributes

- `href` - Hypermedia URL for a `user-progress-outcome-activity` entity
- `token` - Auth token

### Primary Panel

A panel displaying a user's current progress toward achieving a given outcome
within a given course.

#### Usage

```html
<d2l-coa-primary-panel href="" token=""></d2l-coa-primary-panel>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of `user-progress-outcome`
- `token` - Auth token
- `outcomes-tool-link` - Link to the Outcomes Tool in the corresponding course.
Displayed when there are no aligned outcomes in the course.
- `outcome-term` - **[Optional]** The preferred term to use when referring to
outcomes. Accepted values are: `competencies`, `expectations`, `objectives`,
`outcomes` and `standards`. Default value is `standards`

### Stacked Bar

A visual representation of the number of each level achieved on a particular
user/outcome/course tripplet.

#### Usage

```html
<d2l-coa-stacked-bar href="" token="" compact></d2l-coa-stacked-bar>
```

#### Attributes

- `href` - Hypermedia URL for a collection entity of
`user-progress-outcome-activities`
- `token` - Auth token
- `compact` - **[Optional]** Boolean attribute, when present graph will be
displayed in "compact mode" (does not show table on mobile displays)
- `excluded-types` - **[Optional]** JSON array of Activity types to be excluded
from the graph

## Developing

After cloning the repo, run `npm install` to install dependencies.

### Running the Demos

Start local dev server that hosts the demo pages.

```sh
npm start
```

### Linting

```sh
# eslint, lit-analyzer and messageformat-validator
npm run lint

# eslint only
npm run lint:eslint

# lit-analyzer only
npm run lint:lit

# messageformat-validator only
npm run lint:lang
```

### Formatting

```sh
# eslint and messageformat-validator
npm run format

# eslint only
npm run format:eslint

# messageformat-validator only
npm run format:lang
```

### Testing

```sh
# lint and unit tests
npm test

# unit tests
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

### Adding/Updating Lang Term

1. Add the new term to `/lang/en.js`.
2. Run `npm run format`, this will add any new terms to all other languages and
   remove any terms not in `/lang/en.js` from all other languages.
3. Manually add french translations to `/lang/fr.js`.
   - Google translate. This is in case auto-translations don't run in time, if
     we don't have french, we can get fined.

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `master`. Read on for more details...
The [sematic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:

1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:

- Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
- Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
- To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
- Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:

- Update the version in `package.json`
- Tag the commit
- Create a GitHub release (including release notes)

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:

- `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
- `2.x` for feature releases on top of the `2` release (after version `3` exists)
