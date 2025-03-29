export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_member: boolean;
  is_admin: boolean;
}

export interface Message {
  id: number;
  title: string;
  created_at: Date;
  body_text: string;
  author_id: number;
  author: User;
}
