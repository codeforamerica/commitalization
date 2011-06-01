This project is meant to be a visualization of live commits to a project
or set of projects.  Good for codeathon/hackathons/sprints etc.

## Server Side

Using node.js, the server sets up the following:

  * Socket connect to communicate with client.
  * Post URL (/committed) to handle post requests from GitHub
  * Client webpage

## Client Side

On the client side, Javascript handles communication from the server
and updates the page accordingly.

## Installing

This is currently deployable for dotcloud, but could be run
in any environment that runs node.js.

1. Install node
2. Install npm
3. Run `npm install`
4. Run: `node server/server.js`

## Technologies Used

This would not be possible without all these great, open source projects:

  * [Node.js](http://nodejs.org/)
  * [Socket.io](http://socket.io/)
  * [Express](http://expressjs.com/)
  * [HTML5 Boilerplate](http://html5boilerplate.com/)
  * [CSS3](http://www.w3.org/TR/CSS/#css3)
  * [jQuery](http://jquery.com/)
  * [date.format.js](http://blog.stevenlevithan.com/archives/date-time-format)
  * [timeago.js](http://timeago.yarp.com/)
  * [Isotope](http://isotope.metafizzy.co/)
  * [Modernizr](http://www.modernizr.com/)