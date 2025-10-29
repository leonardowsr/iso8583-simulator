const { IsoMessage } = require("../isoMessageModel");

// This runtime helper exposes the filter logic and getPayload used by the subscription.
async function filter(payload) {
	const isoMessage = await IsoMessage.findOne({ _id: payload.isoMessage });
	if (!isoMessage) return false;
	return true;
}

function getPayload(obj) {
	return { isoMessage: obj?.isoMessage };
}

module.exports = { filter, getPayload };
