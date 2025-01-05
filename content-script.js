const dateFormat = /^(\w*-(\d*)-(\w*)-\d*)|(yesterday-\d*)|(today-\d*)$/;
const price = /-?.\d*\.\d{2}$/;

const months = {
	1: "january",
	2: "february",
	3: "march",
	4: "april",
	5: "may",
	6: "june",
	7: "july",
	8: "august",
	9: "september",
	10: "october",
	11: "november",
	12: "december",
};

const today = new Date();
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

const getMonth = (month, year) => {
	let csv = "";
	const s = document.querySelectorAll("section");
	s.forEach((section) => {
		if (
			section.id?.includes(months[month]) ||
			section.id?.includes("today") ||
			section.id?.includes("yesterday")
		) {
			// section represents one date
			const match = section.id.match(dateFormat);
			// if date: matches[2] contains day of month
			// if 'yesterday': matches[4]
			// if 'today': matches[5]

			const transactions = section.querySelectorAll("li");
			transactions.forEach((t) => {
				const divs = t.querySelectorAll("li > div");
				const includeToday = today.getMonth() + 1 === month;
				const includeYesterday = yesterday.getMonth() + 1 === month;
				let date;
				if (match[2]) {
					date = `${match[2]}.${month}.${year || today.getFullYear()}`;
				} else if (includeToday && match[5]) {
					date = `${today.getDate()}.${month}.${today.getFullYear()}`;
				} else if (includeYesterday && match[4]) {
					date = `${yesterday.getDate()}.${month}.${today.getFullYear()}`;
				}

				const name = divs[1].textContent;
				const amount = divs[2].textContent.match(price)?.[0];
				// console.log(divs[2].textContent);

				if (date && !name.match(/Declined$/)) {
					csv = `${date},${name},${amount}\n` + csv;
				}
			});
		}
	});

	return `date,name,amount\n${csv}`;
};

chrome.runtime.onMessage.addListener(
	({ month, year }, sender, sendResponse) => {
		const result = getMonth(month, year);
		sendResponse({ errorMessage: null, result });
	}
);
