module.exports = {
  'name': 'theconversation.social for News & Twitter.com',
  'version': '0.0.0.1',
  'description': 'Bring the Social Conversation with you everywhere on the web! Get instant social from news articles, plus related tweets on Twitter.',
  'manifest_version': 2,
  'background': {
    'scripts': [
      'md5.js',
      'background.js'
    ],
    'persistent': true
  },
  'content_scripts': [{
    'matches': ['http://*/*', 'https://*/*'],
    'js': [
      'doubly-linked-list.js',
      'jquery.min.js',
      'jquery-migrate-3.0.1.js',
      'jquery.qtip.min.js',
      'content-link.js',
      'popup-button.js',
      'content.js',
    ],
    'css': ['jquery.qtip.css', 'fonts.css', 'content.css'],
    'run_at': 'document_start'
  }],
  'browser_action': {
    'default_icon': 'icon-16.png',
    'default_title': 'the conversation .social',
    'default_popup': 'pages/popup.html'
  },
  'icons': {
    '16': 'icon-16.png',
    '48': 'icon-48.png',
    '64': 'icon-64.png',
    '96': 'icon-96.png',
    '128': 'icon-128.png'
  },
  'permissions': [
    'webNavigation',
    'http://*/*',
    'https://*/*',
    'storage',
    'unlimitedStorage'
  ],
  'web_accessible_resources': [
    'fonts/*',
    'payload.js',
    "payload-before.js",
    'icon-16.png',
    'ajax-loader-transparent.gif',
    'c-icon.png',
    'close.png',
    'spinner_200.svg',
    'iframe.html',
    'domainlist.txt',
    'widget/index.html',
    'widget/reading_list.html',
    'widget/recommends_list.html'
  ],
  'content_security_policy': "default-src *; frame-src *; img-src * data:; connect-src *; style-src * 'unsafe-inline'; font-src *; script-src 'self' 'unsafe-eval' https://platform.twitter.com/ https://cdn.syndication.twimg.com/ https://theconversation.social/ 'sha256-lginy85hjkZ5Jnvk7yrHOdHZS3UL3eUfkNrkB6l45KA='; object-src 'self'",
  'options_page': 'options.html'
}
