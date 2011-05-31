This project is meant to be a visualization of live commits to a project
or set of projects.

## Server Side

Using node.js, the server sets up the following:

  * Socket connect to communicate with client.
  * Post URL (/committed) to handle post requests from GitHub
  * Client webpage

## Client Side

On the client side, Javascript handles communication from the server
and updates the page accordingly.

## Installing

This is currently deployable for dotcloud...