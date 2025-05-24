function showNewsCards() {
  const template = HtmlService.createTemplateFromFile("NewsCards");
  template.items = getNewsItems(); // fetch the feed data
  const html = template.evaluate()
    .setWidth(1000)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, "Cybersecurity News");
}

// Dummy data for testing – replace with your actual fetch function
function getNewsItems() {
  return [
    {
      title: "Dark Reading: New Exploit in Wild",
      link: "https://www.darkreading.com/attacks-breaches/new-exploit",
      source: "Dark Reading",
      date: "May 24, 2025"
    },
    {
      title: "Threatpost: Ransomware Surge in 2025",
      link: "https://threatpost.com/ransomware-2025-surge",
      source: "Threatpost",
      date: "May 23, 2025"
    },
    {
      title: "Schneier: Reflections on Security",
      link: "https://www.schneier.com/blog/archives/2025/05/security_reflections.html",
      source: "Schneier on Security",
      date: "May 22, 2025"
    }
  ];
}

