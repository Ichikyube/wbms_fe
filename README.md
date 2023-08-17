
## Usage

`AsyncPaginate` is an alternative of `Async` but supports loading page by page. It is wrapper above default `react-select` thus it accepts all props of default `Select`. And there are some new props:

### loadOptions

Required. Async function that take next arguments:

1. Current value of search input.
2. Loaded options for current search.
3. Collected additional data e.g. current page number etc. For first load it is `additional` from props, for next is `additional` from previous response for current search. `null` by default.

It should return next object:

```
{
  options: Array,
  hasMore: boolean,
  additional?: any,
}
```

It similar to `loadOptions` from `Select.Async` but there is some differences:

1. Loaded options as 2nd argument.
2. Additional data as 3nd argument.
3. Not supports callback.
4. Should return `hasMore` for detect end of options list for current search.

### debounceTimeout

Not required. Number. Debounce timeout for `loadOptions` calls. `0` by default.

### additional

Not required. Default `additional` for first request for every search.

### defaultAdditional

Not required. Default `additional` for empty search if `options` or `defaultOptions` defined.

### shouldLoadMore

Not required. Function. By default new options will load only after scroll menu to bottom. Arguments:

- scrollHeight
- clientHeight
- scrollTop

Should return boolean.

### reduceOptions

Not required. Function. By default new loaded options are concat with previous. Arguments:

- previous options
- loaded options
- next additional

Should return new options.

### cacheUniqs

Not required. Array. Works as 2nd argument of `useEffect` hook. When one of items changed, `AsyncPaginate` cleans all cached options.

### loadOptionsOnMenuOpen

Not required. Boolean. If `false` options will not load on menu opening.

### selectRef

Ref for take `react-select` instance.

## Example

### offset way

```javascript
import { AsyncPaginate } from 'react-select-async-paginate';

...

/*
 * assuming the API returns something like this:
 *   const json = {
 *     results: [
 *       {
 *         value: 1,
 *         label: 'Audi',
 *       },
 *       {
 *         value: 2,
 *         label: 'Mercedes',
 *       },
 *       {
 *         value: 3,
 *         label: 'BMW',
 *       },
 *     ],
 *     has_more: true,
 *   };
 */

async function loadOptions(search, loadedOptions) {
  const response = await fetch(`/awesome-api-url/?search=${search}&offset=${loadedOptions.length}`);
  const responseJSON = await response.json();

  return {
    options: responseJSON.results,
    hasMore: responseJSON.has_more,
  };
}

<AsyncPaginate
  value={value}
  loadOptions={loadOptions}
  onChange={setValue}
/>
```

### page way

```javascript
import { AsyncPaginate } from 'react-select-async-paginate';

...

async function loadOptions(search, loadedOptions, { page }) {
  const response = await fetch(`/awesome-api-url/?search=${search}&page=${page}`);
  const responseJSON = await response.json();

  return {
    options: responseJSON.results,
    hasMore: responseJSON.has_more,
    additional: {
      page: page + 1,
    },
  };
}

<AsyncPaginate
  value={value}
  loadOptions={loadOptions}
  onChange={setValue}
  additional={{
    page: 1,
  }}
/>
```

## Grouped options

You can use `reduceGroupedOptions` util to group options by `label` key.

```javascript
import { AsyncPaginate, reduceGroupedOptions } from 'react-select-async-paginate';

/*
 * assuming the API returns something like this:
 *   const json = {
 *     options: [
 *       label: 'Cars',
 *       options: [
 *         {
 *           value: 1,
 *           label: 'Audi',
 *         },
 *         {
 *           value: 2,
 *           label: 'Mercedes',
 *         },
 *         {
 *           value: 3,
 *           label: 'BMW',
 *         },
 *       ]
 *     ],
 *     hasMore: true,
 *   };
 */

...

<AsyncPaginate
  {...otherProps}
  reduceOptions={reduceGroupedOptions}
/>
```

## Replacing react-select component

You can use `withAsyncPaginate` HOC.

```javascript
import { withAsyncPaginate } from 'react-select-async-paginate';

...

const CustomAsyncPaginate = withAsyncPaginate(CustomSelect);
```

### typescript

Describing type of component with extra props (example with `Creatable`):

```typescript
import type { ReactElement } from 'react';
import type { GroupBase } from 'react-select';
import Creatable from 'react-select/creatable';
import type { CreatableProps } from 'react-select/creatable';

import { withAsyncPaginate } from 'react-select-async-paginate';
import type {
  UseAsyncPaginateParams,
  ComponentProps,
} from 'react-select-async-paginate';

type AsyncPaginateCreatableProps<
OptionType,
Group extends GroupBase<OptionType>,
Additional,
IsMulti extends boolean,
> =
  & CreatableProps<OptionType, IsMulti, Group>
  & UseAsyncPaginateParams<OptionType, Group, Additional>
  & ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
OptionType,
Group extends GroupBase<OptionType>,
Additional,
IsMulti extends boolean = false,
>(props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>) => ReactElement;

const AsyncPaginateCreatable = withAsyncPaginate(Creatable) as AsyncPaginateCreatableType;
```

## Replacing Components

Usage of replacing components is similar with `react-select`, but there is one difference. If you redefine `MenuList` you should wrap it with `wrapMenuList` for workaround of some internal bugs of `react-select`.

```javascript
import { AsyncPaginate, wrapMenuList } from 'react-select-async-paginate';

...

const MenuList = wrapMenuList(CustomMenuList);

<AsyncPaginate
  {...otherProps}
  components={{
    ...otherComponents,
    MenuList,
  }}
/>
```

## Extended usage

If you want construct own component that uses logic of `react-select-async-paginate` inside, you can use next hooks:

- `useAsyncPaginate`
- `useAsyncPaginateBase`
- `useComponents`

```javascript
import {
  useAsyncPaginate,
  useComponents,
} from 'react-select-async-paginate';

...

const CustomAsyncPaginateComponent = ({
  options,
  defaultOptions,
  additional,
  loadOptionsOnMenuOpen,
  debounceTimeout,
  filterOption,
  reduceOptions,
  shouldLoadMore,

  components: defaultComponents,

  value,
  onChange,
}) => {
  const asyncPaginateProps = useAsyncPaginate({
    options,
    defaultOptions,
    additional,
    loadOptionsOnMenuOpen,
    debounceTimeout,
    filterOption,
    reduceOptions,
    shouldLoadMore,
  });

  const components = useComponents(defaultComponents);

  return (
    <CustomSelect
      {...asyncPaginateProps}
      components={components}
      value={value}
      onChange={onChange}
    />
  );
}
```

`useComponents` provides redefined `MenuList` component by default. If you want redefine it, you should also wrap in with `wrapMenuList`.





function DynamicInputArray() {
  const [inputValues, setInputValues] = useState(['']); // Initialize with an empty input

  const handleInputChange = (index, value) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
  };

  const addInput = () => {
    setInputValues([...inputValues, '']);
  };

  return (
    <div>
      {inputValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      ))}
      <button onClick={addInput}>Add Input</button>
      <pre>{JSON.stringify(inputValues, null, 2)}</pre>
    </div>
  );
}


import React, { useState } from 'react';

function DynamicInputArray() {
  const [inputValues, setInputValues] = useState([]);

  // Add more state variables if needed
  // const [otherState, setOtherState] = useState(initialValue);

  // ... rest of your component ...
}


function DynamicInputArray() {
  // ... state setup ...

  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  // ... rest of your component ...
}



function DynamicInputArray() {
  // ... state setup ...

  const handleInputChange = (event, index) => {
    // ... handle input change ...
  };

  return (
    <div>
      {inputValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e, index)}
        />
      ))}
      <button>Add Input</button>
    </div>
  );
}


function DynamicInputArray() {
  // ... state setup ...

  const handleInputChange = (event, index) => {
    // ... handle input change ...
  };

  const addInput = () => {
    setInputValues([...inputValues, '']);
  };

  return (
    <div>
      {inputValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e, index)}
        />
      ))}
      <button onClick={addInput}>Add Input</button>
    </div>
  );
}


import React, { useState } from 'react';

function DynamicInputArray() {
  const [inputValues, setInputValues] = useState(['']); // Initialize with an empty input

  const handleInputChange = (index, value) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = value;
    setInputValues(updatedValues);
  };

  const addInput = () => {
    setInputValues([...inputValues, '']);
  };

  const removeInput = (index) => {
    const updatedValues = inputValues.filter((_, i) => i !== index);
    setInputValues(updatedValues);
  };

  return (
    <div>
      {inputValues.map((value, index) => (
        <div key={index}>
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
          <button onClick={() => removeInput(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addInput}>Add Input</button>
    </div>
  );
}

export default DynamicInputArray;
import React from 'react';
import DynamicInputArray from './DynamicInputArray';

function App() {
  return (
    <div>
      <h1>Dynamic Input Array</h1>
      <DynamicInputArray />
    </div>
  );
}

export default App;
