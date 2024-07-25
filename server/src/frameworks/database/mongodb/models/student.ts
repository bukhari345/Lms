// import mongoose, { Schema, model, Document } from 'mongoose';

// interface ProfilePic {
//   name: string;
//   key?: string;
//   url?: string;
// }
// interface IStudent extends Document {
//   firstName: string;
//   lastName: string;
//   email: string;
//   profilePic: ProfilePic;
//   mobile?: string;
//   password?: string;
//   interests: Array<string>;
//   coursesEnrolled: mongoose.Schema.Types.ObjectId[];
//   dateJoined: Date;
//   isGoogleUser: boolean;
//   isBlocked: boolean;
//   blockedReason: string;
// }

// const ProfileSchema = new Schema<ProfilePic>({
//   name: {
//     type: String,
//     required: true
//   },
//   key: {
//     type: String
//   },
//   url: {
//     type: String
//   }
// });

// const studentSchema = new Schema<IStudent>({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true,
//     lowercase: true,
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//       'Please enter a valid email'
//     ]
//   },
//   profilePic: {
//     type: ProfileSchema,
//     required: false
//   },
//   mobile: {
//     type: String,
//     required: function (this: IStudent) {
//       return !this.isGoogleUser; // Required for non-Google users
//     },
//     trim: true,
//     // unique:true,
//     sparse: true, // Allow multiple null values
//     match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
//   },
//   interests: {
//     type: [String],
//     required: true,
//     default: []
//   },
//   password: {
//     type: String,
//     required: function (this: IStudent) {
//       return !this.isGoogleUser;
//     },
//     minlength: 8
//   },
//   dateJoined: {
//     type: Date,
//     default: Date.now
//   },
//   isGoogleUser: {
//     type: Boolean,
//     default: false
//   },
//   isBlocked: {
//     type: Boolean,
//     default: false
//   },
//   blockedReason: {
//     type: String,
//     default: ''
//   }
// });

// const Students = model<IStudent>('Students', studentSchema, 'students');

// export default Students;
import mongoose, { Schema, model, Document } from 'mongoose';

interface ProfilePic {
  name: string;
  key?: string;
  url?: string;
}

interface Assignment {
  title: string;
  points: number;
  maxPoints: number;
}

interface Quiz {
  title: string;
  score: number;
  maxScore: number;
}

interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  profilePic: ProfilePic;
  mobile?: string;
  password?: string;
  interests: Array<string>;
  coursesEnrolled: mongoose.Schema.Types.ObjectId[];
  dateJoined: Date;
  isGoogleUser: boolean;
  isBlocked: boolean;
  blockedReason: string;
  assignments: Assignment[];
  quizzes: Quiz[];
}

const ProfileSchema = new Schema<ProfilePic>({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String
  },
  url: {
    type: String
  }
});

const AssignmentSchema = new Schema<Assignment>({
  title: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  maxPoints: {
    type: Number,
    required: true
  }
});

const QuizSchema = new Schema<Quiz>({
  title: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  }
});

const studentSchema = new Schema<IStudent>({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  profilePic: {
    type: ProfileSchema,
    required: false
  },
  mobile: {
    type: String,
    required: function (this: IStudent) {
      return !this.isGoogleUser; // Required for non-Google users
    },
    trim: true,
    // unique:true,
    sparse: true, // Allow multiple null values
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  interests: {
    type: [String],
    required: true,
    default: []
  },
  password: {
    type: String,
    required: function (this: IStudent) {
      return !this.isGoogleUser;
    },
    minlength: 8
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: {
    type: String,
    default: ''
  },
  assignments: {
    type: [AssignmentSchema],
    default: []
  },
  quizzes: {
    type: [QuizSchema],
    default: []
  }
});

const Students = model<IStudent>('Students', studentSchema, 'students');

export default Students;
