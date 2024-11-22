
# README: Path Resolver

A utility for callbacks to resolved file paths, directories, symbolic links, and Node.js modules, ensuring a consistent path resolution.

## Features

- **File Resolution**: Resolves absolute and relative file paths.
- **Directory Resolution**: Handles absolute and relative directory paths.
- **Symbolic Link Handling**: Resolves symbolic links to their target paths.
- **Module Resolution**: Supports resolving Node.js core modules, installed modules, and scoped packages.
- **Error Handling**: Provides meaningful error messages for invalid paths, non-existent modules, and unsupported path types.

---

## Installation

```bash
npm install @superhero/path-resolver
```

---

## Usage

### Importing the Module
```javascript
import PathResolver from '@superhero/path-resolver'
```

### Resolving Paths

#### Basic Example
```javascript
const pathResolver = new PathResolver()

const resolveFile      = async (filePath) => `Resolved file: ${filePath}`
const resolveDirectory = async (dirPath)  => `Resolved directory: ${dirPath}`

const result = await pathResolver.resolve('/absolute/path/to/mock/file.js', resolveFile, resolveDirectory)
console.log(result) // Outputs: Resolved file: /absolute/path/to/mock/file.js
```

---

### API

#### **`PathResolver` Class**

#### **`resolve(providedPath, resolveFile, resolveDirectory)`**

- Resolves a given path or module using the provided callbacks.

##### Parameters:
- `providedPath` (string): The path or module name to resolve.
- `resolveFile` (function): Callback for handling file paths. Called with the resolved file path.
- `resolveDirectory` (function): Callback for handling directory paths. Called with the resolved directory path.

##### Returns:
- A promise that resolves to the result of either `resolveFile` or `resolveDirectory`.

##### Throws:
- `E_RESOLVE_PATH`: If the path or module cannot be resolved.

---

### Examples

#### Resolving File Paths
```javascript
const result = await pathResolver.resolve('/absolute/path/to/file.json', resolveFile, resolveDirectory)
console.log(result) // Resolved file: /absolute/path/to/file.json
```

#### Resolving Directory Paths
```javascript
const result = await pathResolver.resolve('/absolute/path/to/directory', resolveFile, resolveDirectory)
console.log(result) // Resolved directory: /absolute/path/to/directory
```

#### Handling Symbolic Links
```javascript
const result = await pathResolver.resolve('/absolute/path/to/symlink', resolveFile, resolveDirectory)
console.log(result) // Resolved directory: /absolute/path/to/real-target
```

#### Resolving Node.js Core Modules
```javascript
const result = await pathResolver.resolve('node:fs', resolveFile, resolveDirectory)
console.log(result) // Resolved file: /path/to/core/module/fs.js
```

#### Resolving Scoped Packages
```javascript
const result = await pathResolver.resolve('@superhero/path-resolver', resolveFile, resolveDirectory)
console.log(result) // Resolved file: /path/to/node_modules/@superhero/path-resolver/index.js
```

#### Handling Invalid Paths
```javascript
try
{
  await pathResolver.resolve('./non-existent-path', resolveFile, resolveDirectory)
} 
catch(error) 
{
  console.error(error.code) // E_RESOLVE_PATH
}
```

---

### Tests

This module includes a comprehensive test suite. To run the tests:

```bash
npm test
```

### Test Coverage

```
▶ @superhero/path-resolver
  ✔ Resolves file paths correctly (4.078047ms)
  ✔ Resolves directory paths correctly (1.574091ms)
  ✔ Handles symbolic links correctly (2.651328ms)
  ✔ Throws error for invalid symbolic link (2.947988ms)
  ✔ Throws error for invalid path (3.607256ms)
  ✔ Resolves paths to Node.js core modules (0.992362ms)
  ✔ Resolves paths to "@superhero/path-resolver" module (1.871912ms)
  ✔ Throws error for non-existent module (0.970715ms)
✔ @superhero/path-resolver (38.619711ms)

tests 8
pass 8

----------------------------------------------------------------
file            | line % | branch % | funcs % | uncovered lines
----------------------------------------------------------------
index.js        |  93.44 |    92.31 |  100.00 | 56-59
index.test.js   | 100.00 |   100.00 |   95.65 | 
----------------------------------------------------------------
all files       |  97.74 |    97.22 |   96.00 | 
----------------------------------------------------------------
```

---

### Error Codes

- **`E_RESOLVE_PATH`**:
  - Thrown when the provided path or module cannot be resolved.

---

### License

This project is licensed under the [MIT License](LICENSE).

---

## Contributing
Feel free to submit issues or pull requests for improvements or additional features.
