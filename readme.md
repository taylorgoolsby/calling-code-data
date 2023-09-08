# calling-code-data

An ESM importable data set containing all calling codes and their mappings to ISO 3166-1 alpha-2 country code.

* Some calling codes map to multiple country codes. For example, `"1": ["CA", "US"]`.
* Some calling codes are unassigned. For example, `"887": ["-"]`.
* Some calling codes are non-geographic. For example, `"800": ["**"]`.

## Snippet

```json
{
  "1": ["CA", "US"],
  "1671": ["GU"],
  "44": ["GB", "GG", "IM", "JE"],
  "63": ["PH"],
  "81": ["JP"],
  "887": ["-"],
  "800": ["**"],
  "881": ["**"]
}
```

## Import

```js
import callingCodeData from 'calling-code-data'
```

## How to regenerate this data set.

1. Copy the outer HTML of the table found on this page: https://en.wikipedia.org/wiki/List_of_country_calling_codes
2. Paste the HTML into `source.html`.
3. `npm run build`.
