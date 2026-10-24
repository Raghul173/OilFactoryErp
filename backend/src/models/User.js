import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['Administrator', 'Factory Manager', 'Factory Staff'],
      default: 'Factory Staff',
    },
    avatar: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'General Operations',
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to output clean user object without password hash
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);
export default User;
