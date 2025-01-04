const monthSelect = document.getElementById("month");
const today = new Date();
let defaultMonth =
	today.getDate() < 5 ? today.getMonth() : today.getMonth() + 1;
if (defaultMonth === 0) defaultMonth = 12;
document
	.querySelector(`select > option[value='${defaultMonth}']`)
	.setAttribute("selected", true);

document.getElementById("form").addEventListener("submit", (event) => {
	event.preventDefault();
	const month = +monthSelect.value;

	chrome.tabs
		.query({
			active: true,
			lastFocusedWindow: true,
		})
		.then(([tab]) => {
			console.log({ tab });
			chrome.tabs.sendMessage(
				tab?.id,
				{
					month,
					year:
						month > today.getMonth() + 1 // if month is in the future, assume user wants prev year
							? today.getFullYear() - 1
							: today.getFullYear(),
				},
				{},
				({ errorMessage, result }) => {
					console.log({ result });
					if (!errorMessage) {
						document.getElementById("transCsv").innerText = result;
						navigator.clipboard.writeText(result);
					}
				}
			);
		});
});
