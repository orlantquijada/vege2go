const formatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short", // This makes the month display as "Jan", "Feb", etc.
	day: "numeric",
});

export function formatShortDate(date: Date) {
	return formatter.format(date);
}
