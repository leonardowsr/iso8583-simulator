import { User } from "./UserModel";

const createDefaultUser = async () => {
	const existingUser = await User.findOne({ email: "admin@example.com" });
	if (!existingUser) {
		const user = new User({
			name: "Admin",
			email: "admin@example.com",
			password: "admin123",
		});
		await user.save();
	}
};

export { createDefaultUser };
