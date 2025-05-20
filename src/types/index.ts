export interface UserInfo {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  photo: string;
  loginDate: string;
}