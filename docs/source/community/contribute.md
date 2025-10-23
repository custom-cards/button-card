## Building

If using the devcontainer, you can the debug directly from the debug tool of VS Code.

This will trigger 2 actions:

- Start Home Assistant
- run `npm run watch` (watching and rebuilding the code automatically)

If you just want to build the project, you can run `npm run build`, the result will land in the `dist` folder.

## Pull requests

Please open all the PRs against the `dev` branch.

This repo uses a VS Code's devcontainer which will configure your environment automatically. Make sure to use it before submitting a PR or it might get rejected (bad liting, bad formating, etc...)

## Edit this documentation

You can edit this documentation directly using the icon :material-file-edit-outline: on the top right of each page and submitting a PR against the `dev` branch.

The documentation uses [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) with the `mike` extension for verioning support (you don't have to worry about that). All the documentation files are in the `docs` folder.

You can test your edits like this when using the devcontainer:

```sh
cd docs
mkdocs serve --livereload
```
