# CLISoundCloudDownloader

## Description

CLISoundCloudDownloader is quick CLI for downloading songs (with cover art) built on top of [SoundCloud.ts](https://www.npmjs.com/package/soundcloud.ts)

## Requirements

- Node.js
- npm

## Installation

1. Type ```git clone https://github.com/emilsharkov/CLISoundCloudDownloader.git``` to clone the repository

2. Navigate to the CLISoundCloudDownloader folder and type ```npm install``` to install the dependencies

## Usage

The mp3 files will be sent to your ```/Downloads/{time}``` folder once you use: 

- ```node CLISoundCloudDownloader.js '<soundcloud url>'``` to download the mp3

- ```node CLISoundCloudDownloader.js -playlist '<soundcloud playlist url>'``` to download the public playlist