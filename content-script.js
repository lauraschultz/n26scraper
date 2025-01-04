const dateFormat = /^\w*-(\d*)-(\w*)-\d*$/;
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

const getMonth = (month, year) => {
	let csv = "";
	const s = document.querySelectorAll("section");
	s.forEach((section) => {
		if (section.id?.includes(months[month])) {
			// section represents one date
			const match = section.id.match(dateFormat);
			const transactions = section.querySelectorAll("li");
			transactions.forEach((t) => {
				const divs = t.querySelectorAll("li > div");
				const date = `${match[1]}.${month}.${year || new Date().getFullYear()}`;
				const name = divs[1].textContent;
				const amount = divs[2].textContent.match(price)?.[0];
				// console.log(divs[2].textContent);

				if (!name.match(/Declined$/)) {
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
		console.log({ result });
		sendResponse({ errorMessage: null, result });
	}
);
