export async function resolveUserId(session, phone) {
  if (session?.user?.id) return session.user.id;

  if (!phone) return null;

  let existing = await User.findOne({ phone });
  if (existing) return existing._id;

  return (await User.create({ phone, name: "Guest User" }))._id;
}