import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    email: {
      type: String,
      required: true,
      trim: true,
    },
    dept: {
      type: String,
      default: '',
      trim: true,
    },
    shift: {
      type: String,
      default: '',
      trim: true,
    },
    allocatedMachine: {
      type: String,
      default: '',
      trim: true,
    },
    attendance: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
