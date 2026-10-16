// Shared Mongoose schema options so every model returns a clean `id` field
// (string) instead of `_id`/`__v`, matching the shape the frontend mock
// already expects (booking.id, mechanic.id, etc.).
export const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString ? ret._id.toString() : ret._id;
    delete ret._id;
    if (ret.passwordHash) delete ret.passwordHash;
    return ret;
  },
};
