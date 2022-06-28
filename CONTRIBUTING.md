# Contribution Guidelines

MeTrack is an open source project, and contributions of any kind are welcome and appreciated. Feel free to open bug tickets and make feature requests. Easy bugs and features will be tagged with the `good first issue` label.

## Issues

If you encounter a bug, please file a bug report. If you have a feature to request, please open a feature request. If you would like to work on an issue or feature, there is no need to request permission. Please add tests to any new features.

## Pull Requests

In order to create a pull request for MeTrack, follow the GitHub instructions for [Creating a pull request from a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Please link your pull request to an existing issue.

## Folder Structure

Description of the project files and directories.

```bash
.
|-- .babelrc
|-- README.md
|-- nodemon.json
|-- package-lock.json
|-- package.json
`-- src
    |-- config
    |-- controllers
    |-- helpers
    |-- mails
    |-- middleware
    |-- models
    |-- routes
    `--  services
```

## Scripts

An explanation of the `package.json` scripts.

| Command         | Description                                   |
| --------------- | ----------------------------------------------|
| `dev`           | Run MeTrack API in a development environment  |
| `build`         | Compile source directory using babel          |
| `start`         | Start MeTrack API in production               |
| `serve`         | Start MeTrack API in production               |
| `restart`       | Clean dist and restart MeTrack API            |
| `clean`         | Clean dist directory                          |
