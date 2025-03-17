export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  creatorId: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface Purchase {
  _id: string;
  userId: string;
  courseId: string;
}