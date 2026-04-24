export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "SELLER" | "BUYER";
};

export type LoginResponse = {
  message: string;
  statusCode: number;
  data: {
    user: AuthUser;
    token: string;
  };
};

export type RegisterResponse = {
  message: string;
  statusCode: number;
  data: AuthUser;
};