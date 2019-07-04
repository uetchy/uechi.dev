const express = require('express')
const path = require('path')
const bio = require('./bio')

const app = express()

function simpleFormat(bio) {
  const res = `# ${bio.name}
  
| email   | ${bio.email} |
| website | ${bio.website} |
| github  | https://github.com/${bio.social.github} |
| twitter | https://twitter.com/${bio.social.twitter} |
`
  return res
}

function htmlFormat(bio) {
  const template = `
<html>
<head>
<meta charset="utf-8" />
<title>${bio.name}</title>
</head>
<body>
<h1>${bio.name}</h1>
<p>
  Email: ${bio.email}
</p>
<p>
  <a href="${bio.website}">Web</a>
</p>
<p>
  <a href="${bio.social.github}">GitHub</a>
</p>
<p>
  <a href="${bio.social.twitter}">Twitter</a>
</p>
</body>
</html>
`
  return template
}

function isTerm(req) {
  return /^curl/.test(req.headers['user-agent'])
}

app.get('/', function(req, res) {
  if (isTerm(req)) {
    res.send(simpleFormat(bio))
  } else {
    res.send(htmlFormat(bio))
  }
})

app.get('/json', function(req, res) {
  res.json(bio)
})

app.get(/^\/(vcard|contact)$/, function(req, res) {
  res.sendFile(path.join(__dirname, 'vcard.vcf'))
})

app.get(/^\/e?mail$/, function(req, res) {
  res.send(bio.email)
})

app.get(/^\/(github|gh)$/, function(req, res) {
  const link = 'https://github.com/' + bio.social.github
  if (isTerm(req)) {
    res.send(link)
  } else {
    res.redirect(link)
  }
})

app.get(/^\/tw(itter)?$/, function(req, res) {
  const link = 'https://twitter.com/' + bio.social.twitter
  if (isTerm(req)) {
    res.send(link)
  } else {
    res.redirect(link)
  }
})

app.get(/^\/(web(page|site)?|home(page)?|blog)?$/, function(req, res) {
  if (isTerm(req)) {
    res.send(bio.website)
  } else {
    res.redirect(bio.website)
  }
})

module.exports = app
