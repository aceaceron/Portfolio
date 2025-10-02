export function formatBestContributionDate(best?: string): string {
  if (!best) return "";
  const parts = best.split(" on ");
  if (parts.length < 2) return "";
  let dateText = parts[1].trim();
  dateText = dateText.replace(/^[A-Za-z]{3,9},?\s*/i, "");
  dateText = dateText.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  let d = new Date(dateText);
  if (isNaN(d.getTime())) {
    const alt = dateText.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    d = new Date(alt);
  }
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return dateText;
}
