function importFeedsToSheet() {
  const feedSources = [
    { url: 'https://www.darkreading.com/rss.xml', source: 'Dark Reading' },
    { url: 'https://threatpost.com/feed/', source: 'Threatpost' },
    { url: 'https://www.schneier.com/feed/atom/', source: 'Schneier on Security' },
    { url: 'https://krebsonsecurity.com/feed/', source: 'Krebs on Security' },
    { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News' },
    { url: 'https://news.sophos.com/en-us/feed/', source: 'Sophos News' },
    { url: 'https://www.hackread.com/feed/', source: 'HackRead' },
    { url: 'https://www.itsecurityguru.org/feed/', source: 'IT Security Guru' },
    { url: 'https://feeds.feedburner.com/securityweek', source: 'SecurityWeek' },
    { url: 'https://isc.sans.edu/rssfeed.xml', source: 'SANS Internet Storm Center' },
    { url: 'https://www.nist.gov/blogs/cybersecurity-insights/rss.xml', source: 'NIST Cybersecurity Insights' },
    { url: 'https://www.cisecurity.org/feed/advisories', source: 'CIS Advisories' }
  ];

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clearContents();
  sheet.appendRow(['Title', 'Source', 'Date']);

  let items = [];

  feedSources.forEach(feed => {
    const url = feed.url;
    const source = feed.source;

    try {
      const response = UrlFetchApp.fetch(url);
      const xml = XmlService.parse(response.getContentText());
      const root = xml.getRootElement();
      let entries = [];

      if (root.getName() === 'rss') {
        entries = root.getChild('channel').getChildren('item');
      } else if (root.getName() === 'feed') {
        entries = root.getChildren('entry');
      }

      entries.forEach(entry => {
        let title = '';
        let link = '';
        let pubDate = '';

        if (root.getName() === 'rss') {
          title = entry.getChildText('title');
          link = entry.getChildText('link');
          pubDate = entry.getChildText('pubDate');
        } else if (root.getName() === 'feed') {
          title = entry.getChildText('title');
          const linkEl = entry.getChild('link');
          if (linkEl && linkEl.getAttribute('href')) {
            link = linkEl.getAttribute('href').getValue();
          }
          pubDate = entry.getChildText('updated') || entry.getChildText('published');
        }

        items.push({
          title: title,
          link: link,
          source: source,
          date: pubDate
        });
      });

    } catch (e) {
      Logger.log('❌ Error fetching/parsing feed: ' + url + ' - ' + e);
    }
  });

  // Sort by date descending
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write to sheet
  items.forEach(item => {
    const safeTitle = item.title ? item.title.replace(/"/g, '""') : 'No title';
    const titleWithLink = `=HYPERLINK("${item.link}", "${safeTitle}")`;
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    sheet.appendRow([titleWithLink, item.source, formattedDate]);
  });

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  // Freeze header row
  sheet.setFrozenRows(1);

  // Remove existing filter if any
  if (sheet.getFilter()) {
    sheet.getFilter().remove();
  }

  // Apply filter
  const range = sheet.getRange(1, 1, lastRow, lastCol);
  range.createFilter();

  // Auto resize columns
  for (let col = 1; col <= lastCol; col++) {
    sheet.autoResizeColumn(col);
  }

  // Remove existing bandings first
  const existingBandings = sheet.getBandings();
  existingBandings.forEach(banding => banding.remove());

  // Apply alternating row colors (banded rows) with green header
  const banding = range.applyRowBanding();
  banding.setHeaderRowColor('#34a853');   // Google Green
  banding.setFirstRowColor('#ffffff');    // White
  banding.setSecondRowColor('#f7f7f7');   // Light grey

  // Set header font color to black
  sheet.getRange(1, 1, 1, lastCol).setFontColor('#000000');

  // Set body font color to black (all rows below header)
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).setFontColor('#000000');
  }
}
