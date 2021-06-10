# MSVC Code Analysis action

Setup MSVC to produce Code Analysis Sarif files for use in `github/codeql-action/upload-sarif@v1`.

## Inputs

### `sarif-output`

**Required** Intermediate folder to produce Sarif file for upload.

### `ruleset`

Ruleset file to determine what static analysis warnings should be enabled.

## Example usage

uses: actions/hello-world-javascript-action@v1.1
with:
  who-to-greet: 'Mona the Octocat'