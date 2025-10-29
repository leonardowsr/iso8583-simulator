const {
	filter,
	getPayload,
} = require("../IsoMessageAddedSubscription.runtime");
const { IsoMessage } = require("../../isoMessageModel");

jest.mock("../../isoMessageModel", () => ({
	IsoMessage: {
		findOne: jest.fn(),
	},
}));

describe("IsoMessageAddedSubscription filter/getPayload", () => {
	beforeEach(() => jest.clearAllMocks());

	it("returns true when iso message exists", async () => {
		const payload = { isoMessage: "msg-1" };
		IsoMessage.findOne.mockResolvedValue({ _id: "msg-1" });

		const res = await filter(payload);
		expect(IsoMessage.findOne).toHaveBeenCalledWith({
			_id: payload.isoMessage,
		});
		expect(res).toBe(true);
	});

	it("returns false when iso message not found", async () => {
		const payload = { isoMessage: "msg-2" };
		IsoMessage.findOne.mockResolvedValue(null);

		const res = await filter(payload);
		expect(res).toBe(false);
	});

	it("getPayload maps isoMessage from obj", () => {
		const obj = { isoMessage: "abc" };
		expect(getPayload(obj)).toEqual({ isoMessage: "abc" });
	});
});
